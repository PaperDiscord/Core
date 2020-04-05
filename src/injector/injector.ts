import 'reflect-metadata';

import { Provider } from '../interfaces/module/provider';
import { CONSTRUCTOR_PARAMTYPES } from '../contants';

export class Injector<Type = any> {
  constructor(public readonly provider: Provider<Type>) {}

  public getConstructorParams(): any[] {
    const classPrototype =
      typeof this.provider === 'function'
        ? this.provider
        : this.provider['useClass']
        ? this.provider['useClass']
        : null;

    if (classPrototype === null) {
      return [];
    }

    const params = Reflect.getMetadata(CONSTRUCTOR_PARAMTYPES, classPrototype);
    return params || [];
  }

  public instantiate(args: any[] = []): Type {
    const classPrototype =
      typeof this.provider === 'function'
        ? this.provider
        : this.provider['useClass']
        ? this.provider['useClass']
        : null;

    if (!classPrototype && this.provider['useValue']) {
      const useValue = this.provider['useValue'];

      return new (Object.getPrototypeOf(useValue).constructor)(...args);
    }

    return new classPrototype(...args);
  }
}
