import { Type } from '../type.interface';
import { Provider } from './provider';

/**
 * @publicApi
 */
export interface ModuleOptions {
  providers?: Provider[];
  imports?: Provider[];
  controllers?: Provider[];
  exports?: Provider[];
}

export interface ModuleMetadata {
  module: Provider<any>;
  data: ModuleOptions;
}
