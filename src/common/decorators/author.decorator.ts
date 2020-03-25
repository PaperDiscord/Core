import { createParamDecorator } from '../../core/decorators';
import {
  OnMessageContext,
  OnMessageDeleteContext,
  OnMessageUpdateContext,
} from '../../core/context/event-context';

export const Author = createParamDecorator({
  commands: (context, input) => context.switchToCommandContext().author,
  events: {
    discord: {
      message: (_, input) =>
        _.switchToEventContext<OnMessageContext>().message.author,
      messageDelete: _ =>
        _.switchToEventContext<OnMessageDeleteContext>().message.author,
      messageUpdate: _ =>
        _.switchToEventContext<OnMessageUpdateContext>().newMessage.author,
    },
  },
});
