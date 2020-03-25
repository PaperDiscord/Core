import {
  MODULE_METADATA,
  PROPERTY_TYPE,
  RETURN_TYPE,
  PROPERTY_DATA,
} from '../constants';
import { PaperApp } from './paper-app';
import { Provider } from './providers/provider';
import { PaperModuleOptions } from './module';
import { Type } from './interfaces';
import { InjectOptions, InjectData } from './inject/inject';
import { Context } from './context';
import { LoggerService } from '../common/services/logger.service';
import { CommandProvider } from './commands/command.provider';
import { Client } from 'discord.js';
import { Logger } from '../common/services/logger';
import { IParamDecorator } from './decorators/create-param-decorator';
export class PaperContainer {
  public static create(module: Type) {
    return new this(module).init();
  }
  public readonly prefixes: Map<string, string> = new Map([['*', '!']]);
  public readonly commands: Map<string, CommandProvider> = new Map();
  public readonly providers: Map<Type, Provider> = new Map();
  public readonly client: Client = new Client();
  public readonly paramResolver: Map<string, IParamDecorator> = new Map();

  private _app: PaperApp;

  private constructor(public readonly module: Type) {}

  public async generateApp() {
    if (this._app) {
      throw Error('App has been generated already');
    }

    this._app = await PaperApp.create(this);
    return this.app;
  }

  public get app() {
    return this._app;
  }

  private async setupProviders() {
    const { providers: _providers } = this.moduleMetadata();

    _providers.forEach(p => {
      this.providers.set(p, new Provider(this, p));
    });

    await Promise.all(
      Array.from(this.providers.values())
        // Initialize the providers which were not found in the module
        .map(async provider => {
          await provider.setupContructorParams();
          return provider;
        }),
    );

    const withAllParamsAsProviders = Array.from(this.providers.values());

    const initialized = await Promise.all(
      withAllParamsAsProviders.map(provider => provider.initialize()),
    );

    const allInjects = await Promise.all(
      initialized.map(async p => {
        await Promise.all(
          Reflect.getMetadataKeys(p.classPrototype.prototype)
            .filter((v: string) => v.startsWith(`__inject_property:`))
            .map((v: string) =>
              Reflect.getMetadata(v, p.classPrototype.prototype),
            )
            .map(async (injectionData: InjectData) => {
              p.isCommander();
              return (p.instance[
                injectionData.property
              ] = await injectionData.metadata.resolver(
                new Context(this.app, 'initial_injection'),
              ));
            }),
        );

        return p;
      }),
    );

    await Promise.all(
      allInjects.map(p => {
        return typeof p.instance.paperOnInit === 'function'
          ? p.instance.paperOnInit()
          : Promise.resolve();
      }),
    );
  }

  private async setupCommandHandlers() {
    Array.from(this.providers.values()).forEach(
      p => p.isCommander() && p.initCommander(),
    );

    this.client.on('message', message => {
      if (message.author.bot) {
        return;
      }

      const prefix =
        this.prefixes.get(message.channel.id) ||
        this.prefixes.get(message.guild?.id || message.channel.id) ||
        this.prefixes.get('*');

      if (!message.content.startsWith(prefix)) {
        return;
      }

      const context = new Context(this.app, 'message_event', message, prefix);

      Array.from(this.commands.values()).forEach(c => {
        c.exec(context);
      });
    });
  }

  private async init() {
    await this.generateApp();
    await this.setupProviders();
    await this.setupCommandHandlers();

    const logger = new Logger('Commands');

    for (const command of this.commands.values()) {
      for (const handler of command.handlers) {
        for (const commandHandler of handler.commandHandlers) {
          logger.info(
            `Mapped ${command.baseCommand} ${commandHandler[1].data.metadata.command} => ${handler.provider.classPrototype.name}.${commandHandler[1].data.property}`,
          );
        }
      }
    }

    return this;
  }

  public moduleMetadata(): PaperModuleOptions {
    const metadata: PaperModuleOptions = Reflect.getMetadata(
      MODULE_METADATA,
      this.module,
    );
    return {
      dependencies: [...metadata.dependencies],
      providers: [LoggerService, this.module, ...metadata.providers],
    };
  }
}
