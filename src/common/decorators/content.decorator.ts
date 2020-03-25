import {
  createParamDecorator,
  OnMessageContext,
  OnMessageDeleteBulkContext,
  OnMessageDeleteContext,
  OnMessageReactionAddContext,
  OnMessageReactionRemoveContext,
  OnMessageReactionRemoveAllContext,
  OnMessageUpdateContext,
} from '../../core';
import { MessageReaction } from 'discord.js';

export const Content = createParamDecorator({
  commands: context => context.switchToCommandContext().message.content,
  events: {
    discord: {
      message: context =>
        context.switchToEventContext<OnMessageContext>().message.content,
      messageDelete: context =>
        context.switchToEventContext<OnMessageDeleteContext>().message.content,
      messageReactionAdd: context =>
        context.switchToEventContext<OnMessageReactionAddContext>().reaction
          .message.content,
      messageReactionRemove: context =>
        context.switchToEventContext<OnMessageReactionRemoveContext>().reaction
          .message.content,
      messageReactionRemoveAll: context =>
        context.switchToEventContext<OnMessageReactionRemoveAllContext>()
          .message.content,
      messageUpdate: (context, newContext = true) =>
        newContext
          ? context.switchToEventContext<OnMessageUpdateContext>().newMessage
              .content
          : context.switchToEventContext<OnMessageUpdateContext>().oldMessage
              .content,
    },
  },
});
