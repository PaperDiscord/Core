import { ClassProvider } from '../module/provider';
import { Type } from '../type.interface';
import { Scope } from '../scope-options.interface';

/**
 * @publicApi
 */
export type ServiceOptions = ServiceOptionsObject;

export type ServiceOptionsObject = {
  scope?: Scope;
};

export interface ServiceData {
  data: ServiceOptions;
}
