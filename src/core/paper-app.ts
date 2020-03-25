import { PaperContainer } from './paper-container';
import { Client } from 'discord.js';
import { Type } from './interfaces';
import { Logger } from '../common/services/logger';
export class PaperApp {
  public readonly logger = new Logger(`PaperApp`);

  public static async create(container: PaperContainer) {
    return new PaperApp(container).init();
  }

  private constructor(private readonly container: PaperContainer) {}

  private async init() {
    return this;
  }

  public async login(token: string) {
    try {
      await this.container.client.login(token);

      this.logger.info(`Logged in as User ${this.client.user.username}`);

      return true;
    } catch (e) {
      throw e;
    }
  }

  public getInstanceFor<Result = any>(type: Type): Result {
    return this.container.providers.get(type)?.instance;
  }

  public get client() {
    return this.container.client;
  }
}
