import { Client, Message, MessageEmbed } from 'discord.js';
import { Module } from '../module/module';
import { Provider } from '../interfaces/module/provider';
import { Context } from '../context/context';
import { ContextId } from '../context/context-id.interface';
import { Type } from '../interfaces/type.interface';
import { InstanceManager, InstanceWrapper } from '../injector/instance-manager';
import { ControllerWrapper } from '../controller/controller-wrapper';
import { PaperApp } from './app';
import { ObservableMap } from '../utils/observable-map';
import { CommandHandler } from '../controller/command/handler';
import { CONTROLLER_OPTIONS, EVENT_METHOD_OPTIONS } from '../contants';
import { Logger } from '../utils/logger';
import { v4 as uuid } from 'uuid';
import { ContextSource } from '../context/context-source';
import { ContextCreator } from '../context/context-creator';
import { Event } from '../interfaces/events/event-options';
import { EventWrapper } from '../event/event-wrapper';
import { EventHandler } from '../event/event-handler';
import { EventEmitter } from 'events';
import { PaperDiscordFactory } from './factory';
import { CanActivate } from '../interfaces/guards/can-activate.interface';

export class PaperContainer extends EventEmitter {
  private readonly logger = new Logger(`PaperContainer`);
  public readonly guards: Map<Type<any>, CanActivate> = new Map();
  public readonly modules: Map<Type<any>, Module> = new Map();
  public readonly providers: ObservableMap<
    Type<any>,
    InstanceManager
  > = new ObservableMap();
  public readonly controllers: Map<Type<any>, ControllerWrapper> = new Map();
  public readonly contextProviders: Map<ContextId, any> = new Map();
  public readonly commandHandlers: Map<string, CommandHandler> = new Map();
  public readonly eventHandlers: Map<Event, EventHandler[]> = new Map();
  public readonly prefixes: Map<string, string[] | string> = new Map([
    ['*', '!'],
  ]);
  public readonly client = new Client();

  private _app: PaperApp;

  public static create(mainModule: Type<any>) {
    return new this(mainModule).init();
  }

  private constructor(private readonly mainModule: Type<any>) {
    super();
    this.modules.set(mainModule, new Module(this, mainModule));
  }

  private async setupModules() {
    while (
      Array.from(this.modules.values()).some((module) => !module.isDoneLoading)
    ) {
      for (const module of Array.from(this.modules.values()).filter(
        (m) => !m.isDoneLoading,
      )) {
        await module.init();
      }
    }
  }

  private async setupControllers() {
    this.logger.verbose(
      `Setting Up Controllers ${Array.from(this.providers.values()).length}`,
    );
    return Promise.all(
      Array.from(this.providers.values())
        .filter((instanceManager) =>
          instanceManager.classReflector.get(CONTROLLER_OPTIONS),
        )
        .map(async (instanceManager) =>
          new ControllerWrapper(this, await instanceManager.get()).init(),
        ),
    );
  }

  private async getCommmandHandlerForCommand(
    commandMessage: Message,
    prefix: string,
  ): Promise<CommandHandler> {
    const cmd = commandMessage.content.replace(/  +/, '').trim();
    const args = cmd.split(' ');
    args[0] = args[0].replace(prefix, '');

    /**
     * : is a param
     *
     * :* is a rest param, meaning the rest of the content
     *
     * Only the commands that match this:
     *
     * - the command handler starts with `args[0]`
     *
     * AND
     *
     * - command contains :* (rest of params)
     * - command length is the same length as the command (includes :)
     */
    const possibleCommandHandlersStrings = Array.from(
      this.commandHandlers.keys(),
    )
      .filter(
        (key) =>
          key.startsWith(`${args[0]}`) &&
          (key.indexOf(`:*`) > -1 || key.split(' ').length === args.length),
      )
      .filter((key) => {
        const splitKey = key.split(' ');
        for (let i = 0; i < splitKey.length; i++) {
          if (splitKey[i].startsWith(':*')) {
            return true;
          } else if (splitKey[i].startsWith(':')) {
            continue;
          } else if (splitKey[i] === args[i]) {
            if (i + 1 === splitKey.length) return true;
            continue;
          }

          return false;
        }
      })
      .sort((a, b) => {
        let aSplit = a.split(' ');
        let bSplit = b.split(' ');
        let aHasLastIndex = undefined;
        for (let i = 0; i < aSplit.length; i++) {
          const aValue = aSplit[i];
          const bValue = bSplit[i];

          if (aValue.startsWith(':') && bValue.split(':')) continue;

          if (bValue.startsWith(':')) aHasLastIndex = true;
          else if (aValue.startsWith(':')) aHasLastIndex = false;
        }
        return aHasLastIndex !== undefined ? (aHasLastIndex ? -1 : 1) : 0;
      });

    let foundCommandHandlerString: string = possibleCommandHandlersStrings[0];

    const lastIndex =
      possibleCommandHandlersStrings[possibleCommandHandlersStrings.length - 1];
    if (lastIndex && lastIndex.indexOf(':') < 0)
      foundCommandHandlerString = lastIndex;

    return foundCommandHandlerString
      ? this.commandHandlers.get(foundCommandHandlerString)
      : null;
  }

  private async setupCommandHandlersCalling() {
    this.client.on('message', async (message) => {
      if (message.author.bot) return;

      let prefixes =
        this.prefixes.get(`guild:${message.guild?.id}`) ??
        this.prefixes.get(`channel:${message.channel?.id}`) ??
        this.prefixes.get(`user:${message.author?.id}`) ??
        this.prefixes.get(`*`);
      if (!Array.isArray(prefixes)) prefixes = [prefixes];

      const content = message.content.replace(/  +/, '').trim();
      const prefix = prefixes.find((prefix) => content.startsWith(prefix));
      if (!prefix) {
        return;
      }

      const contextCreator = new ContextCreator<[Message]>();
      contextCreator.setArgs([message]);
      contextCreator.app = this._app;
      contextCreator.setSource(ContextSource.PaperCommand);

      const handler = await this.getCommmandHandlerForCommand(message, prefix);

      if (!handler) {
        return;
      }

      contextCreator.handler = handler.method;
      contextCreator.class = handler.controller.instanceWrapper.manager.getProviderClass();

      this.emit(Event.PaperCommand, contextCreator.create());

      try {
        const response = await handler.call(contextCreator.create());
        if (typeof response === 'string' || response instanceof MessageEmbed) {
          message.channel.send(response);
        }
      } catch (e) {
        this.logger.error(`An Error has Occured while running a command...`);
        console.error(e);
      }
    });
  }

  public async setupEventWrappers() {
    this.logger.verbose(`Setting Up Event Wrappers`);
    return Promise.all(
      Array.from(this.providers.values())
        .filter((instanceManager) =>
          instanceManager.classReflector.get(EVENT_METHOD_OPTIONS),
        )
        .map(async (instanceManager) => {
          console.log(
            `Setting up for ${instanceManager.getProviderClass().name}`,
          );
          return new EventWrapper(this, await instanceManager.get()).init();
        }),
    );
  }

  private async setupDiscordEventEmitter() {
    return Promise.all(
      Array.from(this.eventHandlers.keys())
        .filter((event) => event.startsWith(Event.DiscordEventBase))
        .map((event) => event.replace(Event.DiscordEventBase, ''))
        .map((event) => {
          this.client.on(event as any, (...args) => {
            this.emit(`${Event.DiscordEventBase}${event}`, args);
          });
        }),
    );
  }

  public async setupEventCalling() {
    this.logger.verbose(
      `Setting up Event Calling for ${
        Array.from(this.eventHandlers.values()).length
      } event handlers`,
    );
    return Promise.all(
      Array.from(this.eventHandlers).map(([event, handlers]) => {
        if (event.startsWith(Event.DiscordEventBase)) {
          const contextCreator = new ContextCreator<any>();
          contextCreator.app = this._app;
          contextCreator.setSource(event);
          this.client.on(
            event.replace(Event.DiscordEventBase, '') as any,
            (...args) => {
              contextCreator.setArgs(args);

              handlers.forEach((handler) =>
                handler.call(contextCreator.create()),
              );
            },
          );
        } else if (event === Event.PaperCommand) {
          this.on(event, (context) => {
            handlers.forEach((handler) =>
              handler.call(Object.assign({}, context)),
            );
          });
        }
      }),
    );
  }

  private async init() {
    await this.setupModules();
    await this.setupControllers();
    await this.setupCommandHandlersCalling();
    // await this.setupEventWrappers();
    await this.setupEventCalling();

    this._app = await PaperApp.create(this);
    return this;
  }

  public getApp() {
    return this._app;
  }
}
