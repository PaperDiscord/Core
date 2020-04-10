import { Provider, ClassProvider, Scope } from '../interfaces';
import { Type } from '../interfaces/type.interface';
import { Reflector } from '../reflector/reflector';
import {
  ServiceOptions,
  ServiceData,
} from '../interfaces/service/service-options.interface';
import { SERVICE_DATA } from '../contants';

type Decorator = ClassDecorator;

export const Service = (
  options: ServiceOptions = { scope: Scope.DEFAULT },
): Decorator => (target) => {
  const reflector = new Reflector(target);
  reflector.set(SERVICE_DATA, <ServiceData>{
    data: options,
  });
};
