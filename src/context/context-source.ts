export enum ContextSource {
  PropertySetter = 'paper:instance:property_setter',
  Unknown = 'unknown',
  PaperCommand = 'paper:command',
  DiscordEventBase = 'discord:event:',
  DiscordEventChannelCreate = 'discord:event:channelCreate',
  DiscordEventChannelDelete = 'discord:event:channelDelete',
  DiscordEventChannelPinsUpdate = 'discord:event:channelPinsUpdate',
  DiscordEventChannelUpdate = 'discord:event:channelUpdate',
  DiscordEventClientUserGuildSettingsUpdate = 'discord:event:clientUserGuildSettingsUpdate',
  DiscordEventClientUserSettingsUpdate = 'discord:event:clientUserSettingsUpdate',
  DiscordEventDisconnect = 'discord:event:disconnect',
  DiscordEventEmojiCreate = 'discord:event:emojiCreate',
  DiscordEventEmojiDelete = 'discord:event:emojiDelete',
  DiscordEventEmojiUpdate = 'discord:event:emojiUpdate',
  DiscordEventError = 'discord:event:error',
  DiscordEventGuildBanAdd = 'discord:event:guildBanAdd',
  DiscordEventGuildBanRemove = 'discord:event:guildBanRemove',
  DiscordEventGuildCreate = 'discord:event:guildCreate',
  DiscordEventGuildDelete = 'discord:event:guildDelete',
  DiscordEventGuildMemberAdd = 'discord:event:guildMemberAdd',
  DiscordEventGuildMemberAvailable = 'discord:event:guildMemberAvailable',
  DiscordEventGuildMemberRemove = 'discord:event:guildMemberRemove',
  DiscordEventGuildMembersChunk = 'discord:event:guildMembersChunk',
  DiscordEventGuildMemberSpeaking = 'discord:event:guildMemberSpeaking',
  DiscordEventGuildMemberUpdate = 'discord:event:guildMemberUpdate',
  DiscordEventGuildUnavailable = 'discord:event:guildUnavailable',
  DiscordEventGuildUpdate = 'discord:event:guildUpdate',
  DiscordEventMessage = 'discord:event:message',
  DiscordEventMessageDelete = 'discord:event:messageDelete',
  DiscordEventMessageDeleteBulk = 'discord:event:messageDeleteBulk',
  DiscordEventMessageReactionAdd = 'discord:event:messageReactionAdd',
  DiscordEventMessageReactionRemove = 'discord:event:messageReactionRemove',
  DiscordEventMessageReactionRemoveAll = 'discord:event:messageReactionRemoveAll',
  DiscordEventMessageUpdate = 'discord:event:messageUpdate',
  DiscordEventPresenceUpdate = 'discord:event:presenceUpdate',
  DiscordEventReady = 'discord:event:ready',
  DiscordEventReconnecting = 'discord:event:reconnecting',
  DiscordEventResume = 'discord:event:resume',
  DiscordEventRoleCreate = 'discord:event:roleCreate',
  DiscordEventRoleDelete = 'discord:event:roleDelete',
  DiscordEventRoleUpdate = 'discord:event:roleUpdate',
  DiscordEventTypingStart = 'discord:event:typingStart',
  DiscordEventTypingStop = 'discord:event:typingStop',
  DiscordEventUserNoteUpdate = 'discord:event:userNoteUpdate',
  DiscordEventUserUpdate = 'discord:event:userUpdate',
  DiscordEventVoiceStateUpdate = 'discord:event:voiceStateUpdate',
}
