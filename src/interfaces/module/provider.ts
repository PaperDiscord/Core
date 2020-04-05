import { Type } from '../type.interface';
import { Scope } from '../scope-options.interface';
import { USE_MODULE } from '../../contants';

/**
 * @publicApi
 */
export type Provider<T = any> =
  | Type<any>
  | ClassProvider<T>
  | ValueProvider<T>
  | ModuleProvider<T>;

type InjectionToken = string | symbol | Type<any> | Function;

interface _Provider {
  /**
   * Injection Token
   */
  provide: InjectionToken;
}

/**
 * @publicApi
 */
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

/**
 * @publicApi
 */
export interface ModuleProvider<T = any> {
  provide: typeof USE_MODULE;

  useModule: Type<T>;
}

/**
 * @publicApi
 */
export interface ValueProvider<T = any> extends _Provider {
  /**
   * The value to be injected
   */
  useValue: T;
}
