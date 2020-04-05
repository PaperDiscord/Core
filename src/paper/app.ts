import { PaperContainer } from './container';
import { ContextId } from '../context/context-id.interface';
import { Type } from '../interfaces/type.interface';

/**
 * @publicApi
 */
export class PaperApp {
  public static async create(container: PaperContainer) {
    return new this(container);
  }

  private constructor(private readonly container: PaperContainer) {}

  public getProviderInstance<Result extends Type<any> = any>(
    providerClass: Result,
    context?: ContextId,
  ) {
    const instanceManager = this.container.providers.get(providerClass);
    return instanceManager ? instanceManager.get(context) : undefined;
  }

  public get _container() {
    return this.container;
  }

  public getClient() {
    return this.container.client;
  }
}
