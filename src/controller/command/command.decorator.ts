import {
  CommandListenerOptions,
  CommandListenerOptionsData,
} from '../../interfaces/controller/command-listener-options.interface';
import { CONTROLLER_COMMAND_METHODS } from '../../contants';
import { Reflector } from '../../reflector/reflector';

type Decorator = MethodDecorator;

export const Command = (
  options: CommandListenerOptions = {
    command: '',
  },
): Decorator => (target, prop, descriptor) => {
  if (typeof options === 'string') {
    options = { command: options };
  }

  const reflector = new Reflector(target);
  reflector.add(CONTROLLER_COMMAND_METHODS, <CommandListenerOptionsData>{
    target,
    data: options,
    function: target[prop],
    functionName: prop,
  });
};
