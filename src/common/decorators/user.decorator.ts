import { createParamDecorator } from '../../core/decorators';

export const CurrentUser = createParamDecorator({
  commands: context => context.switchToCommandContext().author,
});
