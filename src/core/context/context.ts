import { PaperApp } from '../paper-app';
import { CommandContext } from './command-context';
// import { OnMessageContext, BasicEventContext }, * from './event-context';
import './event-context';
import {
  OnChannelCreateContext,
  OnChannelDeleteContext,
  OnChannelPinsUpdateContext,
  OnChannelUpdateContext,
  BasicEventContext,
  OnTypingStartContext,
  OnRoleCreateContext,
  OnMessageContext,
  OnMessageReactionAddContext,
  OnRoleUpdateContext,
  OnVoiceStateUpdateContext,
  OnUserUpdateContext,
  OnUserNoteUpdateContext,
  OnTypingStopContext,
  OnRoleDeleteContext,
  OnResumeContext,
  OnReconnectingContext,
  OnReadyContext,
  OnPresenceUpdateContext,
  OnMessageUpdateContext,
  OnMessageReactionRemoveContext,
  OnMessageReactionRemoveAllContext,
  OnMessageDeleteBulkContext,
  OnMessageDeleteContext,
  OnGuildMembersChunkContext,
  OnGuildMemberUpdateContext,
  OnGuildUnavailableContext,
  OnGuildMemberSpeakingContext,
  OnGuildMemberRemoveContext,
  OnGuildMemberAvailableContext,
  OnGuildMemberAddContext,
  OnGuildDeleteContext,
  OnGuildCreateContext,
  OnGuildBanRemoveContext,
  OnEmojiUpdateContext,
  OnEmojiDeleteContext,
  OnEmojiCreateContext,
  OnDisconnectContext,
  OnGuildUpdateContext,
  OnGuildBanAddContext,
} from './event-context';

export class BasicContext {
  private _handler: Function;

  protected params: any[];
  constructor(
    private _app: PaperApp,
    public readonly type: string,
    ...params: any[]
  ) {
    this.params = [...params];
  }
  public getApp(): PaperApp {
    return this._app;
  }

  public getHandler() {
    return this._handler;
  }

  public _setHandler(handler: Function) {
    this._handler = handler;
    return this;
  }
}

export class Context extends BasicContext {
  protected _commandCtx: CommandContext = new CommandContext(this);
  protected _eventCtx = this._getEventContext() as any;

  public get contextArgs() {
    return this.params;
  }

  public isEvent() {
    return !!this._eventCtx;
  }

  public switchToCommandContext() {
    return this._commandCtx;
  }

  private _getEventContext() {
    console.log(this.type);
    switch (this.type) {
      // case 'discordevent:message':
      //   return new OnMessageContext(this);
      case 'discordevent:channelCreate':
        return new OnChannelCreateContext(this);
      case 'discordevent:channelDelete':
        return new OnChannelDeleteContext(this);
      case 'discordevent:channelPinsUpdate':
        return new OnChannelPinsUpdateContext(this);
      case 'discordevent:channelUpdate':
        return new OnChannelUpdateContext(this);
      // case 'discordevent:clientUserGuildSettingsUpdate':
      //   return new OnClientUserGuildSettingsUpdateContext(this);
      // case 'discordevent:clientUserSettingsUpdate':
      //   return new OnClientUserSettingsUpdateContext(this);
      case 'discordevent:disconnect':
        return new OnDisconnectContext(this);
      case 'discordevent:emojiCreate':
        return new OnEmojiCreateContext(this);
      case 'discordevent:emojiDelete':
        return new OnEmojiDeleteContext(this);
      case 'discordevent:emojiUpdate':
        return new OnEmojiUpdateContext(this);
      case 'discordevent:guildBanAdd':
        return new OnGuildBanAddContext(this);
      case 'discordevent:guildBanRemove':
        return new OnGuildBanRemoveContext(this);
      case 'discordevent:guildCreate':
        return new OnGuildCreateContext(this);
      case 'discordevent:guildDelete':
        return new OnGuildDeleteContext(this);
      case 'discordevent:guildMemberAdd':
        return new OnGuildMemberAddContext(this);
      case 'discordevent:guildMemberAvailable':
        return new OnGuildMemberAvailableContext(this);
      case 'discordevent:guildMemberRemove':
        return new OnGuildMemberRemoveContext(this);
      case 'discordevent:guildMembersChunk':
        return new OnGuildMembersChunkContext(this);
      case 'discordevent:guildMemberSpeaking':
        return new OnGuildMemberSpeakingContext(this);
      case 'discordevent:guildMemberUpdate':
        return new OnGuildMemberUpdateContext(this);
      case 'discordevent:guildUnavailable':
        return new OnGuildUnavailableContext(this);
      case 'discordevent:guildUpdate':
        return new OnGuildUpdateContext(this);
      case 'discordevent:message':
        return new OnMessageContext(this);
      case 'discordevent:messageDelete':
        return new OnMessageDeleteContext(this);
      case 'discordevent:messageDeleteBulk':
        return new OnMessageDeleteBulkContext(this);
      case 'discordevent:messageReactionAdd':
        return new OnMessageReactionAddContext(this);
      case 'discordevent:messageReactionRemove':
        return new OnMessageReactionRemoveContext(this);
      case 'discordevent:messageReactionRemoveAll':
        return new OnMessageReactionRemoveAllContext(this);
      case 'discordevent:messageUpdate':
        return new OnMessageUpdateContext(this);
      case 'discordevent:presenceUpdate':
        return new OnPresenceUpdateContext(this);
      case 'discordevent:ready':
        return new OnReadyContext(this);
      case 'discordevent:reconnecting':
        return new OnReconnectingContext(this);
      case 'discordevent:resume':
        return new OnResumeContext(this);
      case 'discordevent:roleCreate':
        return new OnRoleCreateContext(this);
      case 'discordevent:roleDelete':
        return new OnRoleDeleteContext(this);
      case 'discordevent:roleUpdate':
        return new OnRoleUpdateContext(this);
      case 'discordevent:typingStart':
        return new OnTypingStartContext(this);
      case 'discordevent:typingStop':
        return new OnTypingStopContext(this);
      case 'discordevent:userNoteUpdate':
        return new OnUserNoteUpdateContext(this);
      case 'discordevent:userUpdate':
        return new OnUserUpdateContext(this);
      case 'discordevent:voiceStateUpdate':
        return new OnVoiceStateUpdateContext(this);
    }

    return undefined;
  }

  public switchToEventContext<EventType>(): EventType {
    return this._eventCtx;
  }

  // public switchToOnMessageContext(): OnMessageContext {
  //   if (!this._eventContext.has(`discordevent:message`)) {
  //     this._eventContext.set(
  //       `discordevent:message`,
  //       new OnMessageContext(this),
  //     );
  //   }
  //   return this._eventContext.get(`discordevent:message`);
  // }
}
