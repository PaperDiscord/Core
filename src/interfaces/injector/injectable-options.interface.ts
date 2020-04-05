import { ScopeOptions } from '../scope-options.interface';

/**
 * @publicApi
 */
export type InjectableOptions = ScopeOptions & {};

export interface InjectableData {
  target: Function;
  data: InjectableOptions;
}
