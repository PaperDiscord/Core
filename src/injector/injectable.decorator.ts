import { ScopeOptions } from '../interfaces/scope-options.interface';
import { Reflector } from '../reflector/reflector';
import { INJECTABLE_OPTIONS } from '../contants';
import { InjectableData } from '../interfaces/injector/injectable-options.interface';

export const Injectable = (
  options: ScopeOptions = {},
): ClassDecorator => target => {
  const reflector = new Reflector(target);

  reflector.set(INJECTABLE_OPTIONS, <InjectableData>{
    target,
    data: options,
  });
};
