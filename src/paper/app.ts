import { PaperContainer } from './container';
import { ContextId } from '../context/context-id.interface';
import { Type } from '../interfaces/type.interface';
import { InstanceWrapper } from '../injector/instance-manager';

/**
 * @publicApi
 */
export class PaperApp {
  public static async create(container: PaperContainer) {
    return new this(container);
  }

  private constructor(private readonly container: PaperContainer) {}

  public async getProviderInstance<Result>(
    providerClass: any,
    context?: ContextId,
  ): Promise<Result> {
    const instanceManager = this.container.providers.get(
      (providerClass as any) as Type<any>,
    );

    const result: InstanceWrapper | any = instanceManager
      ? await instanceManager.get(context)
      : undefined;

    if (!result) return undefined;

    if (result instanceof InstanceWrapper) {
      return result.instance;
    }

    return result;
  }

  public get _container() {
    return this.container;
  }

  public getClient() {
    return this.container.client;
  }
}
