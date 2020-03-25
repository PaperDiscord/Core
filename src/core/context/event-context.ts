import { Context } from './context';
import {
  Message,
  Channel,
  Emoji,
  Guild,
  User,
  GuildMember,
  ReactionEmoji,
  MessageReaction,
  GuildMemberEditData,
  Role,
} from 'discord.js';

export class BasicEventContext<Args = []> {
  constructor(protected readonly context: Context) {}

  public get eventName() {
    return this.context.type;
  }

  public get args(): Args {
    return this.context.contextArgs as any;
  }
}

export class OnMessageContext extends BasicEventContext<[Message]> {
  public get message() {
    return this.args[0];
  }
}

// export class OnMessageDeleteContext extends BasicEventContext<[Message]> {}

export class OnMessageDeleteContext extends OnMessageContext {}

export class OnChannelDeleteContext extends BasicEventContext<[Channel]> {
  public get channel() {
    return this.args[0];
  }
}

export class OnChannelCreateContext extends OnChannelDeleteContext {}

export class OnChannelPinsUpdateContext extends BasicEventContext<
  [Channel, Date]
> {
  public get channel() {
    return this.args[0];
  }

  public get date() {
    return this.args[1];
  }
}

export class OnChannelUpdateContext extends OnChannelCreateContext {}

export class OnDisconnectContext extends BasicEventContext<[CloseEvent]> {
  public get event() {
    return this.args[0];
  }
}

export class OnEmojiCreateContext extends BasicEventContext<[Emoji]> {
  public get emoji() {
    return this.args[0];
  }
}

export class OnEmojiDeleteContext extends OnEmojiCreateContext {}

export class OnEmojiUpdateContext extends OnEmojiCreateContext {}

export class OnGuildBanRemoveContext extends BasicEventContext<[Guild, User]> {
  public get guild() {
    return this.args[0];
  }

  public get user() {
    return this.args[1];
  }
}

export class OnGuildBanAddContext extends OnGuildBanRemoveContext {}

export class OnGuildUpdateContext extends BasicEventContext<[Guild, Guild]> {
  public get oldGuild() {
    return this.args[0];
  }

  public get newGuild() {
    return this.args[1];
  }
}

export class OnGuildCreateContext extends BasicEventContext<[Guild]> {
  public get guild() {
    return this.args[0];
  }
}

export class OnGuildDeleteContext extends OnGuildCreateContext {}

export class OnGuildMemberAddContext extends BasicEventContext<[GuildMember]> {
  public get member() {
    return this.args[0];
  }
}

export class OnGuildMemberAvailableContext extends OnGuildMemberAddContext {}

export class OnGuildMemberRemoveContext extends OnGuildMemberAddContext {}

export class OnGuildMembersChunkContext extends BasicEventContext<
  [Array<GuildMember>, Guild]
> {
  public get members() {
    return this.args[0];
  }

  public get guild() {
    return this.args[1];
  }
}

export class OnGuildMemberSpeakingContext extends BasicEventContext<
  [GuildMember, boolean]
> {
  public get member() {
    return this.args[0];
  }

  public get speaking() {
    return this.args[1];
  }
}

export class OnGuildMemberUpdateContext extends BasicEventContext<
  [GuildMember, GuildMember]
> {
  public get oldMember() {
    return this.args[0];
  }

  public get newMember() {
    return this.args[1];
  }
}

export class OnGuildUnavailableContext extends BasicEventContext<[Guild]> {
  public get guild() {
    return this.args[0];
  }
}

export class OnMessageDeleteBulkContext extends BasicEventContext<[Message[]]> {
  public get messages() {
    return this.args[0];
  }
}

export class OnMessageReactionAddContext extends BasicEventContext<
  [MessageReaction, User]
> {
  public get reaction() {
    return this.args[0];
  }
  public get user() {
    return this.args[1];
  }
}

export class OnMessageReactionRemoveContext extends OnMessageReactionAddContext {}

export class OnMessageReactionRemoveAllContext extends OnMessageContext {}

export class OnMessageUpdateContext extends BasicEventContext<
  [Message, Message]
> {
  public get oldMessage() {
    return this.args[0];
  }

  public get newMessage() {
    return this.args[1];
  }
}

export class OnPresenceUpdateContext extends BasicEventContext<
  [GuildMember, GuildMember]
> {
  public get oldMember() {
    return this.args[0];
  }

  public get newMember() {
    return this.args[1];
  }
}

export class OnReadyContext extends BasicEventContext<[]> {
  public get app() {
    return this.context.getApp();
  }

  public get client() {
    return this.context.getApp().client;
  }
}

export class OnReconnectingContext extends BasicEventContext<[]> {}

export class OnResumeContext extends BasicEventContext<[]> {}

export class OnRoleCreateContext extends BasicEventContext<[Role]> {
  public get role() {
    return this.args[0];
  }
}

export class OnRoleDeleteContext extends OnRoleCreateContext {}

export class OnRoleUpdateContext extends OnRoleCreateContext {}

export class OnTypingStartContext extends BasicEventContext<[Channel, User]> {
  public get channel() {
    return this.args[0];
  }

  public get user() {
    return this.args[1];
  }
}

export class OnTypingStopContext extends OnTypingStartContext {}

export class OnUserNoteUpdateContext extends BasicEventContext<
  [User, string, string]
> {
  public get user() {
    return this.args[0];
  }

  public get oldNote() {
    return this.args[1];
  }

  public get newNote() {
    return this.args[2];
  }
}

export class OnUserUpdateContext extends BasicEventContext<[User, User]> {
  public get oldUser() {
    return this.args[0];
  }

  public get newUser() {
    return this.args[1];
  }
}

export class OnVoiceStateUpdateContext extends BasicEventContext<
  [GuildMember, GuildMember]
> {
  public get oldMember() {
    return this.args[0];
  }

  public get newMember() {
    return this.args[1];
  }
}
