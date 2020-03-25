import { CommandProvider } from './command.provider';
import { Provider } from '../providers/provider';
import { IEventHandler, EventType } from './event';
import { Commander } from './commander';
import { COMMANDER_EVENT_PROPERTIES } from '../../constants';
import { Context } from '../context';
import { Logger } from '../../common/services/logger';
import { InjectData } from '../inject/inject';
import { runInThisContext } from 'vm';

export class EventHandler {
  private readonly logger = new Logger('EventHandler');

  private events: Map<
    string,
    Array<{ data: IEventHandler; func: any }>
  > = new Map();

  constructor(public readonly provider: Provider) {}

  public async init() {
    const logger = this.logger.child(`Init`);
    const eventFunctions: Array<{
      data: IEventHandler;
      func: any;
    }> = Reflect.getMetadataKeys(this.provider.classPrototype.prototype)
      .filter(
        (key: string) =>
          key.indexOf(COMMANDER_EVENT_PROPERTIES('').split(':')[0]) > -1,
      )
      .map((key: string) => {
        logger.info('asdads');
        const data = Reflect.getMetadata(
          key,
          this.provider.classPrototype.prototype,
        );

        return {
          data,
          func: this.provider.instance[data.property],
        };
      });

    eventFunctions.forEach(event => {
      switch (event.data.event.type) {
        case EventType.Discord:
          this.provider.container.client.on(
            event.data.event.event,
            (...args) => {
              this.execDiscordEvent(event, args);
            },
          );
      }
    });

    return this;
  }

  private async execDiscordEvent(
    data: { data: IEventHandler; func: any },
    args: any[],
  ) {
    const logger = this.logger.child(
      `ExecDiscordEvent('${data.data.event.event}')`,
    );

    const context = new Context(
      this.provider.container.app,
      `discordevent:${data.data.event.event}`,
      ...args,
    );

    const resolvedParams = await Promise.all(
      Reflect.getMetadataKeys(data.data.object.constructor.prototype)
        .filter((v: string) =>
          v.startsWith(`__inject_function_param:${data.data.property}`),
        )
        .map(v =>
          Reflect.getMetadata(v, data.data.object.constructor.prototype),
        )
        .filter((a, i, arr) => arr.indexOf(a) === i)
        .sort((a: InjectData, b: InjectData) => a.index - b.index)
        .map(async (v: InjectData) => {
          const _logger = logger.child(`FunctionParam-${v.index}`);
          const discordEventResolver = v.metadata?.resolvers?.events
            ? v.metadata.resolvers.events.discord[data.data.event.event]
            : undefined;
          const resolver =
            discordEventResolver ||
            v.metadata?.resolvers?.events?.discord?.default ||
            v.metadata?.resolvers?.events?.default ||
            v.metadata?.resolver;

          _logger.verbose(
            `Index ${v.index} will be resolved with Resolver ${resolver.name}`,
          );

          return {
            index: v.index,
            value: resolver ? await resolver(context) : undefined,
          };
        }),
    );

    logger.verbose(`Pushing Function Parameters`);
    const paramsToInject = [];
    for (const param of resolvedParams) {
      for (let i = paramsToInject.length; i < param.index; i++) {
        paramsToInject.push(undefined);
      }
      paramsToInject.push(param.value);
    }

    try {
      logger.verbose(
        `Calling ${this.provider.classPrototype.name}.${data.data.property} with ${paramsToInject.length} params`,
      );

      await data.func(...paramsToInject);
    } catch {}
  }
}
