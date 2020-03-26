import {
  createParamDecorator,
  OnMessageContext,
  OnMessageDeleteContext,
  OnMessageReactionAddContext,
  OnMessageReactionRemoveAllContext,
  OnMessageReactionRemoveContext,
  OnMessageUpdateContext,
} from '../../core';

export const CurrentMessage = createParamDecorator({
  commands: context => context.switchToCommandContext().message,
  events: {
    discord: {
      message: c => c.switchToEventContext<OnMessageContext>().message,
      messageDelete: c =>
        c.switchToEventContext<OnMessageDeleteContext>().message,
      messageReactionAdd: c =>
        c.switchToEventContext<OnMessageReactionAddContext>().reaction.message,
      messageReactionRemove: c =>
        c.switchToEventContext<OnMessageReactionRemoveContext>().reaction
          .message,
      messageUpdate: (c, newMessage = true) =>
        newMessage
          ? c.switchToEventContext<OnMessageUpdateContext>().newMessage
          : c.switchToEventContext<OnMessageUpdateContext>().oldMessage,
      messageReactionRemoveAll: c =>
        c.switchToEventContext<OnMessageReactionRemoveAllContext>().message,
    },
  },
});
