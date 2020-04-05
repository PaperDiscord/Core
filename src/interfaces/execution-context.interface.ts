import {
  User,
  Message,
  Channel,
  Client,
  Emoji,
  Guild,
  GuildMember,
  MessageReaction,
  Role,
} from 'discord.js';
import { PaperApp } from '../paper/app';
import { Type } from './type.interface';
import { ContextSource } from '../context/context-source';

/**
 * @publicApi
 */
export interface ExecutionContext {
  id: string;
  source: ContextSource;

  getApp(): PaperApp;

  getClient(): Client;

  getHandler(): Function;

  getClass<T = any>(): Type<T>;
  switchToCommandContext(): CommandExecutionContext;

  getArgs<T extends Array<any> = any>(): T;
}

/**
 * @publicApi
 */
export interface CommandExecutionContext {
  getAuthor(): User;

  getMessage(): Message;

  getChannel(): Channel;
}

/**
 * @publicApi
 */
export interface EventContext {}

/**
 * Credit for everything bellow this point, goes to Koad at GitHub, with his amazing discordjs cheatsheet
 *
 * https://gist.github.com/koad/316b265a91d933fd1b62dddfcc3ff584
 */

/**  */
interface GetChannel {
  /**
   * The Channel that the context refers to
   *
   */
  getChannel(): Channel;
}

interface GetAuthor {
  /**
   * The author of the message
   */
  getAuthor(): User;
}

interface GetUser {
  /**
   * The User that the context refers to
   */
  getUser(): User;
}

interface GetMessage {
  /**
   * The message that the context refers to
   */
  getMessage(): Message;
}

interface GetTime {
  getTime(): Date;
}

interface GetEmoji {
  /**
   * The emoji that the context refers to
   */
  getEmoji(): Emoji;
}

/**
 * @publicApi
 */
export interface Unknown {
  [key: string]: any;
}

interface GetGuild {
  getGuild(): Guild;
}

interface GetMember {
  getMember(): GuildMember;
}

interface GetSpeaking {
  isSpeaking(): boolean;
}

interface GetReaction {
  getReaction(): MessageReaction;
}

interface GetRole {
  getRole(): Role;
}

/**
 * Emitted whenever a channel is deleted.
 *
 * @publicApi
 */
export interface ChannelCreateContext extends EventContext, GetChannel {
  /** The channel that is created */
  getChannel(): Channel;
}

/**
 * Emitted whenever a channel is created.
 *
 * @publicApi
 */
export interface ChannelDeleteContext extends EventContext, GetChannel {
  /** The channel that was deleted */
  getChannel(): Channel;
}

/**
 * Emitted whenever the pins of a channel are updated.
 * Due to the nature of the WebSocket event, not much
 * information can be provided easily here -
 * you need to manually check the pins yourself.
 *
 * @publicApi
 */
export interface ChannelPinsUpdateContext
  extends EventContext,
    GetChannel,
    GetTime {
  /** The channel that the pins update occurred in */
  getChannel(): Channel;
  /**  The time of the pins update */
  getTime(): Date;
}

/** Emitted whenever a channel is updated - e.g. name change, topic change.
 *
 * @publicApi */
export interface ChannelUpdateContext extends EventContext, GetChannel {
  /** The channel before the update */
  getOldChannel(): Channel;

  /** The channel after the update */
  getChannel(): Channel;
}

/** Emitted whenever the client user's settings update.
 *
 * @publicApi */
export interface ClientUserGuildSettingsUpdateContext
  extends EventContext,
    Unknown {}

/** Emitted when the client user's settings update.
 *
 * @publicApi */
export interface ClientUserSettingsUpdateContext
  extends EventContext,
    Unknown {}

// /** Emitted when the client's WebSocket disconnects and will no longer attempt to reconnect.
//  *
//  * @publicApi */
// export interface DisconnectContext {
//   /** The WebSocket close event */
//   getEvent(): CloseEvent;
// }

/** Emitted whenever a custom emoji is created in a guild.
 *
 * @publicApi
 */
export interface EmojiCreateContext extends EventContext, GetEmoji {
  /** The emoji that was created */
  getEmoji(): Emoji;
}

/** Emitted whenever a custom guild emoji is deleted.
 *
 * @publicApi
 */
export interface EmojiDeleteContext extends EventContext, GetEmoji {
  /** The emoji that was deleted */
  getEmoji(): Emoji;
}

/** Emitted whenever a custom guild emoji is updated.
 *
 * @publicApi
 */
export interface EmojiUpdateContext extends EventContext, GetEmoji {
  /** The new Emoji */
  getEmoji(): Emoji;

  /** The Old Emoji */
  getOldEmoji(): Emoji;
}

/** Emitted whenever the client's WebSocket encounters a connection error.
 *
 * @publicApi
 */
export interface ErrorContext {
  /** The encountered error */
  getError(): Error;
}

/**
 * @publicApi
 */
export interface GuildBanAddContext extends EventContext, GetGuild, GetUser {}

/**
 * @publicApi
 */
export interface GuildBanRemoveContext
  extends EventContext,
    GetGuild,
    GetUser {}

/**
 * @publicApi
 */
export interface GuildCreateContext extends EventContext, GetGuild {}

/**
 * @publicApi
 */
export interface GuildDeleteContext extends EventContext, GetGuild {}

/**
 * @publicApi
 */
export interface GuildMemberAddContext extends EventContext, GetMember {}

/**
 * @publicApi
 */
export interface GuildMemberAvailableContext extends EventContext, GetMember {}

/**
 * @publicApi
 */
export interface GuildMemberRemoveContext extends EventContext, GetMember {}

/**
 * @publicApi
 */
export interface GuildMembersChunkContext extends EventContext, GetGuild {
  getMembers(): GuildMember[];
}

/**
 * @publicApi
 */
export interface GuildMemberSpeakingContext
  extends EventContext,
    GetSpeaking,
    GetMember {}

/**
 * @publicApi
 */
export interface GuildMemberUpdateContext extends EventContext, GetMember {
  getOldMember(): GuildMember;
}

/**
 * @publicApi
 */
export interface GuildUnavailableContext extends EventContext, GetGuild {}

/**
 * @publicApi
 */
export interface GuildUpdateContext extends EventContext, GetGuild {
  oldGuild(): Guild;
}

/**
 * @publicApi
 */
export interface MessageContext extends EventContext, GetMessage {}

/**
 * @publicApi
 */
export interface MessageDeleteContext extends EventContext, GetMessage {}

/**
 * @publicApi
 */
export interface MessageDeleteBulkContext {
  getMessages(): Message[];
}

/**
 * @publicApi
 */
export interface MessageReactionAddContext
  extends EventContext,
    GetReaction,
    GetUser {}

/**
 * @publicApi
 */
export interface MessageReactionRemoveContext
  extends EventContext,
    GetReaction,
    GetUser {}

/**
 * @publicApi
 */
export interface MessageReactionRemoveAllContext
  extends EventContext,
    GetReaction {}

/**
 * @publicApi
 */
export interface MessageUpdateContext extends EventContext, GetMessage {
  getOldMessage(): Message;
}

/**
 * @publicApi
 */
export interface PresenceUpdateContext extends EventContext, GetMember {
  getOldMember(): GuildMember;
}

/**
 * @publicApi
 */
export interface ReadyContext {}

/**
 * @publicApi
 */
export interface ReconnectingContext {}

/**
 * @publicApi
 */
export interface ResumeContext {
  getResumed(): number;
}

/**
 * @publicApi
 */
export interface RoleCreateContext extends EventContext, GetRole {}

/**
 * @publicApi
 */
export interface RoleDeleteContext extends EventContext, GetRole {}

/**
 * @publicApi
 */
export interface RoleUpdateContext extends EventContext, GetRole {
  getOldRole(): Role;
}

/**
 * @publicApi
 */
export interface TypingStartContext extends EventContext, GetChannel, GetUser {}

/**
 * @publicApi
 */
export interface TypingStopContext extends EventContext, GetChannel, GetUser {}

/**
 * @publicApi
 */
export interface UserNoteUpdateContext extends EventContext, GetUser {
  getNote(): string;
  getOldNote(): string;
}

/**
 * @publicApi
 */
export interface UserUpdateContext extends EventContext, GetUser {}

/**
 * @publicApi
 */
export interface VoiceStateUpdateContext extends EventContext, GetMember {
  getOldMember(): GuildMember;
}
