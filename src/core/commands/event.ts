import { COMMANDER_EVENT_PROPERTIES } from '../../constants';

export enum EventType {
  Discord = 'discord',
  PaperApp = 'paperapp',
}

interface IEvent {
  type: EventType | string;
  event: string;
}

export type DiscordEvent = IEvent;

export const DiscordEvents = {
  channelCreate: { event: 'channelCreate', type: 'discord' },
  channelDelete: { event: 'channelDelete', type: 'discord' },
  channelPinsUpdate: { event: 'channelPinsUpdate', type: 'discord' },
  channelUpdate: { event: 'channelUpdate', type: 'discord' },
  clientUserGuildSettingsUpdate: {
    event: 'clientUserGuildSettingsUpdate',
    type: 'discord',
  },
  clientUserSettingsUpdate: {
    event: 'clientUserSettingsUpdate',
    type: 'discord',
  },
  disconnect: { event: 'disconnect', type: 'discord' },
  emojiCreate: { event: 'emojiCreate', type: 'discord' },
  emojiDelete: { event: 'emojiDelete', type: 'discord' },
  emojiUpdate: { event: 'emojiUpdate', type: 'discord' },
  error: { event: 'error', type: 'discord' },
  guildBanAdd: { event: 'guildBanAdd', type: 'discord' },
  guildBanRemove: { event: 'guildBanRemove', type: 'discord' },
  guildCreate: { event: 'guildCreate', type: 'discord' },
  guildDelete: { event: 'guildDelete', type: 'discord' },
  guildMemberAdd: { event: 'guildMemberAdd', type: 'discord' },
  guildMemberAvailable: {
    event: 'guildMemberAvailable',
    type: 'discord',
  },
  guildMemberRemove: { event: 'guildMemberRemove', type: 'discord' },
  guildMembersChunk: { event: 'guildMembersChunk', type: 'discord' },
  guildMemberSpeaking: { event: 'guildMemberSpeaking', type: 'discord' },
  guildMemberUpdate: { event: 'guildMemberUpdate', type: 'discord' },
  guildUnavailable: { event: 'guildUnavailable', type: 'discord' },
  guildUpdate: { event: 'guildUpdate', type: 'discord' },
  message: { event: 'message', type: 'discord' },
  messageDelete: { event: 'messageDelete', type: 'discord' },
  messageDeleteBulk: { event: 'messageDeleteBulk', type: 'discord' },
  messageReactionAdd: { event: 'messageReactionAdd', type: 'discord' },
  messageReactionRemove: {
    event: 'messageReactionRemove',
    type: 'discord',
  },
  messageReactionRemoveAll: {
    event: 'messageReactionRemoveAll',
    type: 'discord',
  },
  messageUpdate: { event: 'messageUpdate', type: 'discord' },
  presenceUpdate: { event: 'presenceUpdate', type: 'discord' },
  ready: { event: 'ready', type: 'discord' },
  reconnecting: { event: 'reconnecting', type: 'discord' },
  resume: { event: 'resume', type: 'discord' },
  roleCreate: { event: 'roleCreate', type: 'discord' },
  roleDelete: { event: 'roleDelete', type: 'discord' },
  roleUpdate: { event: 'roleUpdate', type: 'discord' },
  typingStart: { event: 'typingStart', type: 'discord' },
  typingStop: { event: 'typingStop', type: 'discord' },
  userNoteUpdate: { event: 'userNoteUpdate', type: 'discord' },
  userUpdate: { event: 'userUpdate', type: 'discord' },
  voiceStateUpdate: { event: 'voiceStateUpdate', type: 'discord' },
};

export interface IEventHandler {
  property: string;
  event: IEvent;
  object: any;
}

export const EventHandler = (event: IEvent | DiscordEvent): MethodDecorator => (
  target,
  property,
  descriptor,
) => {
  Reflect.defineMetadata(
    COMMANDER_EVENT_PROPERTIES(property.toString()),
    {
      property: property.toString(),
      event,
      object: target,
    },
    target,
  );
};
