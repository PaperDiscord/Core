import { Context } from '../context';
import { v4 as uuid } from 'uuid';
import { Inject } from '../inject/inject';

export interface IParamDecorator {}

type ParamCallback = (context: Context, input: any) => any | Promise<any>;

export const createParamDecorator = (
  callbackOrCallbacks:
    | ParamCallback
    | {
        param?: ParamCallback;
        default?: ParamCallback;
        commands?: ParamCallback;
        events?: {
          paperApp?: {
            default?: ParamCallback;
            [event: string]: ParamCallback;
          };
          discord?: {
            default?: ParamCallback;

            channelCreate?: ParamCallback;
            channelDelete?: ParamCallback;
            channelPinsUpdate?: ParamCallback;
            channelUpdate?: ParamCallback;
            clientUserGuildSettingsUpdate?: ParamCallback;
            clientUserSettingsUpdate?: ParamCallback;
            disconnect?: ParamCallback;
            emojiCreate?: ParamCallback;
            emojiDelete?: ParamCallback;
            emojiUpdate?: ParamCallback;
            error?: ParamCallback;
            guildBanAdd?: ParamCallback;
            guildBanRemove?: ParamCallback;
            guildCreate?: ParamCallback;
            guildDelete?: ParamCallback;
            guildMemberAdd?: ParamCallback;
            guildMemberAvailable?: ParamCallback;
            guildMemberRemove?: ParamCallback;
            guildMembersChunk?: ParamCallback;
            guildMemberSpeaking?: ParamCallback;
            guildMemberUpdate?: ParamCallback;
            guildUnavailable?: ParamCallback;
            guildUpdate?: ParamCallback;
            message?: ParamCallback;
            messageDelete?: ParamCallback;
            messageDeleteBulk?: ParamCallback;
            messageReactionAdd?: ParamCallback;
            messageReactionRemove?: ParamCallback;
            messageReactionRemoveAll?: ParamCallback;
            messageUpdate?: ParamCallback;
            presenceUpdate?: ParamCallback;
            ready?: ParamCallback;
            reconnecting?: ParamCallback;
            resume?: ParamCallback;
            roleCreate?: ParamCallback;
            roleDelete?: ParamCallback;
            roleUpdate?: ParamCallback;
            typingStart?: ParamCallback;
            typingStop?: ParamCallback;
            userNoteUpdate?: ParamCallback;
            userUpdate?: ParamCallback;
            voiceStateUpdate?: ParamCallback;
            [event: string]: ParamCallback;
          };
        };
      },
) => {
  const paramid = uuid();
  return (input: any = undefined) =>
    Inject(
      typeof callbackOrCallbacks === 'function'
        ? {
            resolver: context => callbackOrCallbacks(context, input),
          }
        : {
            resolver: context => callbackOrCallbacks.param(context, input),
            resolvers: callbackOrCallbacks,
          },
    );
};
