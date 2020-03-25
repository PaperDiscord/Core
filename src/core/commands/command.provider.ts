import { PaperContainer } from '../paper-container';
import { Type } from '../interfaces';
import { Provider } from '../providers/provider';
import { CommandHandler } from './command-handler';
import { Context } from '../context';
import { LoggerService } from '../../common/services/logger.service';
import { Inject } from '../inject/inject';
import { EventHandler } from './event-handler';

export class CommandProvider {
  public readonly handlers: CommandHandler[] = [];
  public readonly eventHandlers: EventHandler[] = [];

  constructor(
    public readonly container: PaperContainer,
    public readonly baseCommand: string,
  ) {}

  public async addProvider(provider: Provider) {
    this.handlers.push(await new CommandHandler(this, provider).init());
    this.eventHandlers.push(await new EventHandler(provider).init());
  }

  public async exec(context: Context) {
    this.handlers.forEach(h => {
      h.exec(context);
    });
  }
}
