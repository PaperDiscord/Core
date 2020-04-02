import { v4 as uuid } from 'uuid';
import { Type } from '../interfaces/type.interface';
import {
  Provider,
  ValueProvider,
  ClassProvider,
} from '../interfaces/module/provider';
import { PaperContainer } from '../paper/container';
import { Scope } from '../interfaces/scope-options.interface';
import { Context } from '../context/context';

export const INSTANCE_METADATA_SYMBOL = Symbol.for('instance_metadata:cache');

export class InstanceWrapper<T = any> {
  public inject: (string | symbol | Function | Type<any>)[];

  public readonly id = uuid();

  constructor(
    private readonly container: PaperContainer,
    public readonly provider: Provider,
  ) {}

  public instantiate(context?: Context) {
    return typeof this.provider === 'function'
      ? new this.provider(...this.inject)
      : this.provider['useClass']
      ? this.asClass(context)
      : this.asValue();
  }

  private asClass(context?: Context) {
    const provider = this.provider as ClassProvider;

    if (provider.scope === Scope.DEFAULT) {
      return this.container.providers.has(this.provider)
        ? this.container.providers.get(this.provider)
        : this.container.providers
            .set(this.provider, new provider.useClass(...this.inject))
            .get();
    }
  }

  private asValue() {
    const provider = this.provider as ValueProvider;

    return provider.useValue;
  }
}
