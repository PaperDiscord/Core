import {
  InjectOptions,
  InjectPropertyData,
} from '../interfaces/injector/inject-options.interface';
import { Reflector } from '../reflector/reflector';
import {
  INSTANCE_WRAPPER_METHOD_PARAMS,
  INSTANCE_WRAPPER_PROPERTY_INJECTS,
} from '../contants';
// import { Decorator } from '../common/decorators/create-decorator';

type Decorator = PropertyDecorator & ParameterDecorator;

const paramDecorator = (
  options: InjectOptions,
  target: object,
  prop: symbol | string,
  index: number,
) => {
  // const property = prop.toString();
  const reflector = new Reflector(target);

  reflector.add(INSTANCE_WRAPPER_METHOD_PARAMS, {
    functionName: prop,
    index,
    options,
  });
};

const propDecorator = (
  options: InjectOptions,
  target: object,
  prop: symbol | string,
) => {
  const reflector = new Reflector(target);

  reflector.add(INSTANCE_WRAPPER_PROPERTY_INJECTS, <InjectPropertyData>{
    property: prop,
    options,
    type: Reflect.getMetadata(`design:type`, target, prop),
  });
};

export const Inject = (options: InjectOptions = {}): Decorator => (
  target: object,
  property: string | symbol,
  index?: number,
) => {
  if (options.injectInstance === undefined && !options.executors)
    options.injectInstance = true;
  if (index >= 0) paramDecorator(options, target, property, index);
  else propDecorator(options, target, property);
};
