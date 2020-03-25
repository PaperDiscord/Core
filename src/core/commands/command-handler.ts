import { CommandProvider } from './command.provider';
import { Provider } from '../providers/provider';
import { Context } from '../context';
import { CommandOptions, ICommand } from './command';
import {
  COMMANDER_COMMAND_PROPERTIES,
  INJECT_FUNCTION_PARAM,
} from '../../constants';
import { InjectData } from '../inject/inject';
import { MessageEmbed } from 'discord.js';
import { Logger } from '../../common/services/logger';
import { LoggerLevel } from '../../common/services/logger.service';

/**
 * @Command('hello') => !play hello
 */

export interface Handler {
  data: ICommand;
  func: any;
}

export class CommandHandler {
  public readonly commandHandlers: Map<string, Handler> = new Map();

  private readonly logger = new Logger(`CommandHander`);

  constructor(
    public readonly commandProvider: CommandProvider,
    public readonly provider: Provider,
  ) {}

  public async init() {
    const commandFunctions: Array<{
      data: ICommand;
      func: any;
    }> = Reflect.getMetadataKeys(this.provider.classPrototype.prototype)
      .filter(
        (key: string) =>
          key.indexOf(COMMANDER_COMMAND_PROPERTIES('').split(':')[0]) > -1,
      )
      .map((key: string) => {
        const data = Reflect.getMetadata(
          key,
          this.provider.classPrototype.prototype,
        );
        return {
          data,
          func: this.provider.instance[data.property],
        };
      });

    commandFunctions.forEach(handler =>
      this.commandHandlers.set(handler.data.metadata.command, handler),
    );

    return this;
  }

  private getHandlerForContext(context: Context) {
    const commandContext = context.switchToCommandContext();

    const args = commandContext.args();

    const handlerEntries = Array.from(this.commandHandlers.keys())
      .map(v => v.split(' '))
      .filter(
        entries =>
          entries.length === args.length ||
          entries[entries.length - 1] === '**' ||
          entries.some(entry => entry.startsWith(':*')),
      );

    let foundEntry: Handler;
    let general = false;

    for (const entries of handlerEntries) {
      let possible = false;
      let found: Handler;
      for (let i = 0; i < entries.length; i++) {
        if (entries[i].startsWith(':*')) {
          possible = true;
          found = this.commandHandlers.get(entries.join(' '));
          break;
        }
        if (entries[i].startsWith(':')) continue;

        if (entries[i] === args[i]) {
          possible = true;
          found = this.commandHandlers.get(entries.join(' '));

          if (entries[i + 1] === '**') {
            break;
          }
        }

        if (entries[i] === '*' && !general) {
          general = true;
          found = this.commandHandlers.get(entries.join(' '));
          possible = true;
          break;
        }

        if (!possible) break;
      }

      if (possible) {
        foundEntry = found;
      }
    }

    return foundEntry;
  }

  public async exec(context: Context) {
    const commandContext = context.switchToCommandContext();

    const logger = this.logger.child(`Exec(${commandContext.fullCommand()})`);

    logger.verbose(`Getting Handler...`);
    const handler = this.getHandlerForContext(context);

    if (!handler) {
      return;
    }

    logger.verbose(
      `Found Command Handler: ${this.provider.classPrototype.name}.${handler.data.property}`,
    );

    const command = handler.data.metadata.command.split(' ');

    const params: { [key: string]: string } = {};

    logger.verbose(`Setting The Command Params: with ${command.join(' ')}`);
    for (let i = 0; i < command.length; i++) {
      const commandEntry = command[i];
      if (!commandEntry.startsWith(':')) continue;

      if (commandEntry.startsWith(':*')) {
        params[commandEntry.replace(':*', '')] = commandContext
          .args()
          .slice(i)
          .join(' ');
      }
      params[commandEntry.replace(':', '')] = commandContext.arg(i);
    }

    commandContext._setCommandParams(params);
    logger.verbose(`Command Params have been set to ${params}`);

    logger.verbose(`Resolving Function Parameters to Inject`);
    const resolvedParams = await Promise.all(
      Reflect.getMetadataKeys(handler.data.object.constructor.prototype)
        .filter((v: string) =>
          v.startsWith(`__inject_function_param:${handler.data.property}`),
        )
        .map(v =>
          Reflect.getMetadata(v, handler.data.object.constructor.prototype),
        )
        .filter((a, i, arr) => arr.indexOf(a) === i)
        .sort((a: InjectData, b: InjectData) => a.index - b.index)
        .map(async (v: InjectData) => {
          const _logger = logger.child(`FunctionParam-${v.index}`);
          const resolver =
            v.metadata?.resolvers?.commands || v.metadata?.resolver;

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
        `Calling ${this.provider.classPrototype.name}.${handler.data.property} with ${paramsToInject.length} params`,
      );
      const response = await handler.func(...paramsToInject);

      if (
        typeof response === 'string' ||
        typeof response === 'number' ||
        response instanceof MessageEmbed
      ) {
        commandContext.message.channel.send(response);
      }
    } catch {}
  }
}
