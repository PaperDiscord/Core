import { createParamDecorator } from '../../core/decorators';
import {
  OnMessageContext,
  OnMessageDeleteContext,
  OnMessageReactionAddContext,
  OnMessageReactionRemoveAllContext,
  OnMessageUpdateContext,
  OnRoleCreateContext,
  OnRoleDeleteContext,
  OnRoleUpdateContext,
  OnChannelCreateContext,
  OnChannelDeleteContext,
  OnChannelPinsUpdateContext,
  OnChannelUpdateContext,
  OnEmojiCreateContext,
  OnEmojiDeleteContext,
  OnEmojiUpdateContext,
  OnGuildBanAddContext,
  OnGuildBanRemoveContext,
  OnGuildCreateContext,
  OnGuildDeleteContext,
  OnGuildMemberAddContext,
  OnGuildMemberAvailableContext,
  OnGuildMemberRemoveContext,
  OnGuildMemberSpeakingContext,
  OnGuildMemberUpdateContext,
  OnGuildMembersChunkContext,
  OnGuildUnavailableContext,
  OnGuildUpdateContext,
} from '../../core/context/event-context';
import { GuildChannel, GuildEmoji } from 'discord.js';

export const CurrentGuild = createParamDecorator({
  commands: context => context.switchToCommandContext().message.guild,
  events: {
    discord: {
      message: context =>
        context.switchToEventContext<OnMessageContext>().message.guild,
      messageDelete: context =>
        context.switchToEventContext<OnMessageDeleteContext>().message.guild,
      messageReactionAdd: context =>
        context.switchToEventContext<OnMessageReactionAddContext>().reaction
          .message.guild,
      messageReactionRemove: context =>
        context.switchToEventContext<OnMessageReactionRemoveAllContext>()
          .message.guild,
      messageReactionRemoveAll: context =>
        context.switchToEventContext<OnMessageReactionRemoveAllContext>()
          .message.guild,
      messageUpdate: context =>
        context.switchToEventContext<OnMessageUpdateContext>().newMessage.guild,
      roleCreate: context =>
        context.switchToEventContext<OnRoleCreateContext>().role.guild,
      roleDelete: context =>
        context.switchToEventContext<OnRoleDeleteContext>().role.guild,
      roleUpdate: context =>
        context.switchToEventContext<OnRoleUpdateContext>().role.guild,
      channelCreate: context => {
        const channel = context.switchToEventContext<OnChannelCreateContext>()
          .channel;

        return channel instanceof GuildChannel ? channel.guild : null;
      },
      channelDelete: context => {
        const channel = context.switchToEventContext<OnChannelDeleteContext>()
          .channel;

        return channel instanceof GuildChannel ? channel.guild : null;
      },
      channelPinsUpdate: context => {
        const channel = context.switchToEventContext<
          OnChannelPinsUpdateContext
        >().channel;

        return channel instanceof GuildChannel ? channel.guild : null;
      },
      channelUpdate: context => {
        const channel = context.switchToEventContext<OnChannelUpdateContext>()
          .channel;

        return channel instanceof GuildChannel ? channel.guild : null;
      },
      emojiCreate: context => {
        const emoji = context.switchToEventContext<OnEmojiCreateContext>()
          .emoji;

        return emoji instanceof GuildEmoji ? emoji.guild : null;
      },
      emojiDelete: context => {
        const emoji = context.switchToEventContext<OnEmojiDeleteContext>()
          .emoji;

        return emoji instanceof GuildEmoji ? emoji.guild : null;
      },
      emojiUpdate: context => {
        const emoji = context.switchToEventContext<OnEmojiUpdateContext>()
          .emoji;

        return emoji instanceof GuildEmoji ? emoji.guild : null;
      },
      guildBanAdd: context =>
        context.switchToEventContext<OnGuildBanAddContext>().guild,
      guildBanRemove: context =>
        context.switchToEventContext<OnGuildBanRemoveContext>().guild,
      guildCreate: context =>
        context.switchToEventContext<OnGuildCreateContext>().guild,
      guildDelete: context =>
        context.switchToEventContext<OnGuildDeleteContext>().guild,
      guildMemberAdd: context =>
        context.switchToEventContext<OnGuildMemberAddContext>().member.guild,

      guildMemberAvailable: context =>
        context.switchToEventContext<OnGuildMemberAvailableContext>().member
          .guild,
      guildMemberRemove: context =>
        context.switchToEventContext<OnGuildMemberRemoveContext>().member.guild,
      guildMemberSpeaking: context =>
        context.switchToEventContext<OnGuildMemberSpeakingContext>().member
          .guild,
      guildMemberUpdate: context =>
        context.switchToEventContext<OnGuildMemberUpdateContext>().newMember
          .guild,
      guildMembersChunk: context =>
        context.switchToEventContext<OnGuildMembersChunkContext>().guild,
      guildUnavailable: context =>
        context.switchToEventContext<OnGuildUnavailableContext>().guild,
      guildUpdate: (context, getNew = true) =>
        getNew
          ? context.switchToEventContext<OnGuildUpdateContext>().newGuild
          : context.switchToEventContext<OnGuildUpdateContext>().oldGuild,
    },
  },
});
