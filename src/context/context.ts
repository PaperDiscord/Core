import { ContextId } from './context-id.interface';
import { ContextSource } from './context-source';
import { PaperApp } from '../paper/app';
import {
  ExecutionContext,
  CommandExecutionContext,
} from '../interfaces/execution-context.interface';
import * as Ctx from '../interfaces/execution-context.interface';
import { Message } from 'discord.js';
import { InstanceWrapper } from '../injector/instance-manager';
import { ContextCreator } from './context-creator';

/**
 */
export class Context<Args extends Array<any> = any>
  implements ContextId, ExecutionContext {
  constructor(
    public readonly contextCreator: ContextCreator<Args>,
    public readonly app: PaperApp,
    public readonly id: string,
    public readonly source: ContextSource,
    protected readonly args: Args,
    public readonly handler?: Function,
    public readonly instanceWrapper?: InstanceWrapper<any>,
  ) {}

  getApp() {
    return this.app;
  }

  getClient() {
    return this.app as any;
  }

  getArgs<T extends Array<any> = any>(): T {
    return this.args as any;
  }

  private set(functions: any = {}) {
    return functions;
    // return Object.assign(this, functions);
  }

  switchToCommandContext(): CommandExecutionContext {
    const message: Message = this.args[0];
    return this.set({
      getAuthor() {
        return message.author;
      },
      getMessage() {
        return message;
      },
      getChannel() {
        return message.channel;
      },
      getHandler: () => {
        return this.handler;
      },
      getClass: () => {
        return this.instanceWrapper.manager.getProviderClass();
      },
    });
  }

  switchToEventContext<Event extends Ctx.EventContext = Ctx.Unknown>(): Event {
    const arg0 = () => this.args[0];
    const arg1 = () => this.args[0];
    switch (this.source) {
      case ContextSource.DiscordEventChannelCreate:
        return this.set(<Ctx.ChannelCreateContext>{
          getChannel: arg0,
        });
      case ContextSource.DiscordEventChannelDelete:
        return this.set(<Ctx.ChannelDeleteContext>{
          getChannel: arg1,
        });
      case ContextSource.DiscordEventChannelPinsUpdate:
        return this.set(<Ctx.ChannelPinsUpdateContext>{
          getChannel: arg0,
          getTime: arg1,
        });
      case ContextSource.DiscordEventChannelUpdate:
        return this.set(<Ctx.ChannelUpdateContext>{
          getChannel: arg1,
          getOldChannel: arg0,
        });
      case ContextSource.DiscordEventClientUserGuildSettingsUpdate:
        return this.set(<Ctx.ClientUserGuildSettingsUpdateContext>{});
      case ContextSource.DiscordEventClientUserSettingsUpdate:
        return this.set(<Ctx.ClientUserSettingsUpdateContext>{});
      // case ContextSource.DiscordEventDisconnect:
      //   return this.set(<Ctx.DisconnectContext>{
      //     getEvent: arg0,
      //   });
      case ContextSource.DiscordEventEmojiCreate:
        return this.set(<Ctx.EmojiCreateContext>{
          getEmoji: arg0,
        });
      case ContextSource.DiscordEventEmojiDelete:
        return this.set(<Ctx.EmojiDeleteContext>{
          getEmoji: arg0,
        });
      case ContextSource.DiscordEventEmojiUpdate:
        return this.set(<Ctx.EmojiUpdateContext>{
          getOldEmoji: arg0,
          getEmoji: arg1,
        });
      case ContextSource.DiscordEventError:
        return this.set(<Ctx.ErrorContext>{
          getError: arg0,
        });
      case ContextSource.DiscordEventGuildBanAdd:
        return this.set(<Ctx.GuildBanAddContext>{
          getGuild: arg0,
          getUser: arg1,
        });
      case ContextSource.DiscordEventGuildBanRemove:
        return this.set(<Ctx.GuildBanRemoveContext>{
          getGuild: arg0,
          getUser: arg1,
        });
      case ContextSource.DiscordEventGuildCreate:
        return this.set(<Ctx.GuildCreateContext>{ getGuild: arg0 });
      case ContextSource.DiscordEventGuildDelete:
        return this.set(<Ctx.GuildDeleteContext>{ getGuild: arg0 });
      case ContextSource.DiscordEventGuildMemberAdd:
        return this.set(<Ctx.GuildMemberAddContext>{ getMember: arg0 });
      case ContextSource.DiscordEventGuildMemberAvailable:
        return this.set(<Ctx.GuildMemberAvailableContext>{ getMember: arg0 });
      case ContextSource.DiscordEventGuildMemberRemove:
        return this.set(<Ctx.GuildMemberRemoveContext>{ getMember: arg0 });
      case ContextSource.DiscordEventGuildMembersChunk:
        return this.set(<Ctx.GuildMembersChunkContext>{
          getGuild: arg0,
          getMembers: arg1,
        });
      case ContextSource.DiscordEventGuildMemberSpeaking:
        return this.set(<Ctx.GuildMemberSpeakingContext>{
          getMember: arg0,
          isSpeaking: arg1,
        });
      case ContextSource.DiscordEventGuildMemberUpdate:
        return this.set(<Ctx.GuildMemberUpdateContext>{
          getMember: arg1,
          getOldMember: arg0,
        });
      case ContextSource.DiscordEventGuildUnavailable:
        return this.set(<Ctx.GuildUnavailableContext>{ getGuild: arg0 });
      case ContextSource.DiscordEventGuildUpdate:
        return this.set(<Ctx.GuildUpdateContext>{
          getGuild: arg1,
          oldGuild: arg0,
        });
      case ContextSource.DiscordEventMessage:
        return this.set(<Ctx.MessageContext>{ getMessage: arg0 });
      case ContextSource.DiscordEventMessageDelete:
        return this.set(<Ctx.MessageDeleteContext>{ getMessage: arg0 });
      case ContextSource.DiscordEventMessageDeleteBulk:
        return this.set(<Ctx.MessageDeleteBulkContext>{ getMessages: arg0 });
      case ContextSource.DiscordEventMessageReactionAdd:
        return this.set(<Ctx.MessageReactionAddContext>{
          getReaction: arg0,
          getUser: arg1,
        });
      case ContextSource.DiscordEventMessageReactionRemove:
        return this.set(<Ctx.MessageReactionRemoveContext>{
          getReaction: arg0,
          getUser: arg1,
        });
      case ContextSource.DiscordEventMessageReactionRemoveAll:
        return this.set(<Ctx.MessageReactionRemoveAllContext>{
          getReaction: arg0,
        });
      case ContextSource.DiscordEventMessageUpdate:
        return this.set(<Ctx.MessageUpdateContext>{
          getOldMessage: arg0,
          getMessage: arg1,
        });
      case ContextSource.DiscordEventPresenceUpdate:
        return this.set(<Ctx.PresenceUpdateContext>{
          getOldMember: arg0,
          getMember: arg1,
        });
      case ContextSource.DiscordEventReady:
        return this.set(<Ctx.ReadyContext>{});
      case ContextSource.DiscordEventReconnecting:
        return this.set(<Ctx.ReconnectingContext>{});
      case ContextSource.DiscordEventResume:
        return this.set(<Ctx.ResumeContext>{ getResumed: arg0 });
      case ContextSource.DiscordEventRoleCreate:
        return this.set(<Ctx.RoleCreateContext>{ getRole: arg0 });
      case ContextSource.DiscordEventRoleDelete:
        return this.set(<Ctx.RoleDeleteContext>{ getRole: arg0 });
      case ContextSource.DiscordEventRoleUpdate:
        return this.set(<Ctx.RoleUpdateContext>{
          getOldRole: arg0,
          getRole: arg1,
        });
      case ContextSource.DiscordEventTypingStart:
        return this.set(<Ctx.TypingStartContext>{
          getChannel: arg0,
          getUser: arg1,
        });
      case ContextSource.DiscordEventTypingStop:
        return this.set(<Ctx.TypingStopContext>{
          getUser: arg1,
          getChannel: arg0,
        });
      case ContextSource.DiscordEventUserNoteUpdate:
        return this.set(<Ctx.UserNoteUpdateContext>{
          getUser: arg0,
          getOldNote: arg1,
          getNote: () => this.args[2],
        });
      case ContextSource.DiscordEventUserUpdate:
        return this.set(<Ctx.UserUpdateContext>{ getUser: arg0 });
      case ContextSource.DiscordEventVoiceStateUpdate:
        return this.set(<Ctx.VoiceStateUpdateContext>{
          getMember: arg1,
          getOldMember: arg0,
        });
    }
  }

  public getClass() {
    return this.instanceWrapper.manager.getProviderClass();
  }

  public getHandler() {
    return this.handler;
  }
}
