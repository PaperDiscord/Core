import { ExecutionContext } from '../execution-context.interface';
import { Type } from '../type.interface';

export interface CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean>;
}
