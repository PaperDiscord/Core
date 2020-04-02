import { Type } from '../type.interface';
import { Scope } from '../scope-options.interface';

export type Provider<T = any> = Type<any> | ClassProvider<T> | ValueProvider<T>;

type InjectionToken = string | symbol | Type<any> | Function;

interface _Provider {
  /**
   * Injection Token
   */
  provide: InjectionToken;
}

export interface ClassProvider<T = any> extends _Provider {
  /**
   * The class to use for the Injection
   */
  useClass: Type<T>;

  /**
   * The lifetime of the provider
   */
  scope?: Scope;
}

export interface ValueProvider<T = any> extends _Provider {
  /**
   * The value to be injected
   */
  useValue: T;
}
