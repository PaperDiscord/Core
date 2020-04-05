import { Context } from '../../context/context';
import { Observable } from 'rxjs';
import { Type } from '../type.interface';
import { ExecutionContext } from '../execution-context.interface';

export type InjectExecutor<Return = any> = (
  input: string,
  context: ExecutionContext,
) => Return | Promise<Return> | Observable<Return> | any;

/**
 * @publicApi
 */
export interface InjectOptions {
  input?: any;

  injectInstance?: boolean;

  /**
   * These are the functions that will be called to resolve the injection
   */
  executors?: InjectExecutors;
}

export interface InjectExecutors {
  default?: InjectExecutor;
  property?: InjectExecutor;
  command?: InjectExecutor;
  events?: {
    discord?: {
      default?: InjectExecutor;

      channelCreate?: InjectExecutor;
      channelDelete?: InjectExecutor;
      channelPinsUpdate?: InjectExecutor;
      channelUpdate?: InjectExecutor;
      clientUserGuildSettingsUpdate?: InjectExecutor;
      clientUserSettingsUpdate?: InjectExecutor;
      disconnect?: InjectExecutor;
      emojiCreate?: InjectExecutor;
      emojiDelete?: InjectExecutor;
      emojiUpdate?: InjectExecutor;
      error?: InjectExecutor;
      guildBanAdd?: InjectExecutor;
      guildBanRemove?: InjectExecutor;
      guildCreate?: InjectExecutor;
      guildDelete?: InjectExecutor;
      guildMemberAdd?: InjectExecutor;
      guildMemberAvailable?: InjectExecutor;
      guildMemberRemove?: InjectExecutor;
      guildMembersChunk?: InjectExecutor;
      guildMemberSpeaking?: InjectExecutor;
      guildMemberUpdate?: InjectExecutor;
      guildUnavailable?: InjectExecutor;
      guildUpdate?: InjectExecutor;
      message?: InjectExecutor;
      messageDelete?: InjectExecutor;
      messageDeleteBulk?: InjectExecutor;
      messageReactionAdd?: InjectExecutor;
      messageReactionRemove?: InjectExecutor;
      messageReactionRemoveAll?: InjectExecutor;
      messageUpdate?: InjectExecutor;
      presenceUpdate?: InjectExecutor;
      ready?: InjectExecutor;
      reconnecting?: InjectExecutor;
      resume?: InjectExecutor;
      roleCreate?: InjectExecutor;
      roleDelete?: InjectExecutor;
      roleUpdate?: InjectExecutor;
      typingStart?: InjectExecutor;
      typingStop?: InjectExecutor;
      userNoteUpdate?: InjectExecutor;
      userUpdate?: InjectExecutor;
      voiceStateUpdate?: InjectExecutor;
    };
  };
}

export interface InjectMethodData {
  functionName: string | symbol;
  index: number;
  options: InjectOptions;
}

export interface InjectPropertyData {
  property: string | symbol;
  options: InjectOptions;
  type: Type<any>;
}
