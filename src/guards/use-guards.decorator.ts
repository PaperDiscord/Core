import { Reflector } from '../reflector/reflector';
import {
  INSTANCE_WRAPPER_CLASS_GUARD,
  INSTANCE_WRAPPER_METHOD_GUARD,
} from '../contants';
import { UseGuardsData } from '../interfaces/guards/use-guards-options';
import { Type } from '../interfaces/type.interface';

type Decorator = ClassDecorator & MethodDecorator;

const classDecorator = (guards: Type<any>[], target: any) => {
  const classReflector = new Reflector(target);
  guards.forEach((guard) =>
    classReflector.add(INSTANCE_WRAPPER_CLASS_GUARD, guard),
  );
};

const methodDecorator = (
  guards: Type<any>[],
  target: object,
  property: string | symbol,
) => {
  const classReflector = new Reflector(target);
  guards.forEach((guard) =>
    classReflector.add(INSTANCE_WRAPPER_METHOD_GUARD, <UseGuardsData>{
      data: guards,
      function: target[property],
      functionName: property,
    }),
  );
};

export const UseGuards = (...guards: Type<any>[]): Decorator => (
  ...args: any[]
) => {
  if (args.length === 1) classDecorator(guards, args[0]);
  else methodDecorator(guards, args[0], args[1]);
};
