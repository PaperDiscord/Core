import {
  CreateDecoratorOptions,
  CreateDecoratorFunction,
} from '../interfaces/create-decorator-options.interface';
import { Inject } from '../../injector/inject.decorator';

/**
 * @publicApi
 */
export type Decorator = PropertyDecorator & ParameterDecorator;

/**
 *
 * @param options
 *
 * @publicApi
 */
export const createDecorator = (
  options: CreateDecoratorOptions | CreateDecoratorFunction,
) => (input?: string): Decorator => (
  target: Object,
  property: string | symbol,
  index?: number,
) => {
  Inject({
    input,
    executors: typeof options === 'function' ? { default: options } : options,
  })(target, property, index);
};

createDecorator((i, c) => c);
