import {
  ControllerOptions,
  ControllerOptionsData,
} from '../interfaces/controller/controller-options.interface';
import { CONTROLLER_OPTIONS } from '../contants';

type Decorator = ClassDecorator;

export const Controller = (
  options: ControllerOptions = { baseCommand: '' },
): Decorator => (target) => {
  if (typeof options === 'string') options = { baseCommand: options };

  Reflect.defineMetadata(
    CONTROLLER_OPTIONS,
    <ControllerOptionsData>{
      data: options,
    },
    target,
  );
};
