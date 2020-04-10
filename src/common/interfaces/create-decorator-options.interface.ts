import { Context } from '../../context/context';
import { Observable } from 'rxjs';
import { InjectableData } from '../../interfaces/injector/injectable-options.interface';
import {
  InjectOptions,
  InjectExecutor,
  InjectExecutors,
} from '../../interfaces/injector/inject-options.interface';

/**
 * The Observable is only used for the Properties of a Class, so they can be updated, otherwise, the Observable itself is returned
 *
 * @publicApi
 */
export type CreateDecoratorFunction<Type = any> = InjectExecutor<Type>;

/**
 * @publicApi
 */
export interface CreateDecoratorOptions extends InjectExecutors {}

import * as t from './discord-js.interface';
