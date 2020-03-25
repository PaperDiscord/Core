import {
  INJECT_FUNCTION_PARAM,
  PROPERTY_TYPE,
  PROPERTY_DATA,
} from '../../constants';
import { BehaviorSubject } from 'rxjs';
import { Context } from '../context';

export interface InjectOptions {
  /**
   * @param input The Input is provided only when it is needed in a Param Decorator. In a Property decorator, it is always undefined
   */
  resolver?: (context: Context, input?: any) => any | Promise<any>;
  /** This only works if it is a property, and not a param in a function */
  watch?: <T = any>(subject: BehaviorSubject<T>, context: any) => void;

  resolvers?: {
    commands?: (context: Context, input?: any) => any | Promise<any>;
    events?: {
      default?: (context: Context, input?: any) => any | Promise<any>;
      paperApp?: {
        default?: (context: Context, input?: any) => any | Promise<any>;
        [event: string]: (context: Context, input?: any) => any | Promise<any>;
      };
      discord?: {
        default?: (context: Context, input?: any) => any | Promise<any>;
        [event: string]: (context: Context, input?: any) => any | Promise<any>;
      };
    };
  };
}

export interface InjectData {
  index?: number;
  property: string | symbol;
  type: any;
  metadata: InjectOptions;
}

export const Inject = (options: InjectOptions = {}): any => (
  target: Object,
  propertyKey: string | symbol,
  index?: number,
) => {
  const type = Reflect.getOwnMetadata(PROPERTY_TYPE, target, propertyKey);
  if (!options.resolver) {
    options.resolver = context => {
      return undefined;
    };
  }

  if (index !== undefined && index !== null) {
    Reflect.defineMetadata(
      INJECT_FUNCTION_PARAM(propertyKey.toString(), index),
      {
        index,
        property: propertyKey,
        type: Reflect.getOwnMetadata(PROPERTY_TYPE, target, propertyKey),
        metadata: options,
      },
      target,
    );
  } else {
    Reflect.defineMetadata(
      PROPERTY_DATA(propertyKey.toString()),
      {
        property: propertyKey,
        type: Reflect.getOwnMetadata(PROPERTY_TYPE, target, propertyKey),
        metadata: options,
      },
      target,
    );
  }
};
