import { COMMANDER_COMMAND_PROPERTIES } from '../../constants';

export interface CommandOptions {
  command: string;
}

export interface ICommand {
  property: string;
  metadata: CommandOptions;
  object: Object;
}

export const Command = (
  options: string | CommandOptions = '',
): MethodDecorator => (target, prop, descriptor) => {
  if (typeof options === 'string') {
    options = { command: options };
  }

  Reflect.defineMetadata(
    COMMANDER_COMMAND_PROPERTIES(prop.toString()),
    {
      property: prop.toString(),
      metadata: options,
      object: target,
    },
    target,
  );
};
