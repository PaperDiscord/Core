import { createParamDecorator } from '../../core/decorators';

export const Param = createParamDecorator({
  commands: (context, input) =>
    context.switchToCommandContext().getCommandParam(String(input)),
  default: () => undefined,
});
