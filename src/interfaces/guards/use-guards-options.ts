import { CanActivate } from './can-activate.interface';
import { Type } from '../type.interface';

/**
 * @publicApi
 */
export type UseGuardsOptions = Type<any>[];

export interface UseGuardsData {
  function: Function;
  functionName: string | symbol;

  data: UseGuardsOptions;
}
