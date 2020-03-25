import { createParamDecorator } from '../../core/decorators';
import {
  OnChannelCreateContext,
  OnChannelPinsUpdateContext,
  OnChannelDeleteContext,
  OnChannelUpdateContext,
  OnMessageContext,
  OnMessageDeleteContext,
  OnMessageReactionAddContext,
  OnMessageReactionRemoveContext,
  OnMessageReactionRemoveAllContext,
  OnMessageUpdateContext,
  OnTypingStartContext,
  OnTypingStopContext,
  OnVoiceStateUpdateContext,
} from '../../core/context/event-context';

export const Channel = createParamDecorator({
  commands: context => context.switchToCommandContext().message.channel,
  events: {
    discord: {
      default: () => null,
      channelCreate: context =>
        context.switchToEventContext<OnChannelCreateContext>().channel,
      channelPinsUpdate: context =>
        context.switchToEventContext<OnChannelPinsUpdateContext>().channel,
      channelDelete: context =>
        context.switchToEventContext<OnChannelDeleteContext>().channel,
      channelUpdate: context =>
        context.switchToEventContext<OnChannelUpdateContext>().channel,
      message: context =>
        context.switchToEventContext<OnMessageContext>().message.channel,
      messageDelete: context =>
        context.switchToEventContext<OnMessageDeleteContext>().message.channel,
      messageReactionAdd: context =>
        context.switchToEventContext<OnMessageReactionAddContext>().reaction
          .message.channel,
      messageReactionRemove: context =>
        context.switchToEventContext<OnMessageReactionRemoveContext>().reaction
          .message.channel,
      messageReactionRemoveAll: context =>
        context.switchToEventContext<OnMessageReactionRemoveAllContext>()
          .message.channel,
      messageUpdate: context =>
        context.switchToEventContext<OnMessageUpdateContext>().newMessage
          .channel,
      typingStart: context =>
        context.switchToEventContext<OnTypingStartContext>().channel,
      typingStop: context =>
        context.switchToEventContext<OnTypingStopContext>().channel,
      voiceStateUpdate: context =>
        context.switchToEventContext<OnVoiceStateUpdateContext>().newMember
          .voice,
    },
  },
});
