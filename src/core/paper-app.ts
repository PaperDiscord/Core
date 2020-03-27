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

  /**
   * Logs in to the Discord Gateway
   *
   * If a token is not provided, then `process.env.TOKEN` is used
   *
   * @param token The Discord Bot Token
   */
  public async login(token: string) {
    if (!token) {
      require('dotenv').config();
      token = process.env.TOKEN;
    }

    if (!token) {
      throw Error('Invalid Token');
    }

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
