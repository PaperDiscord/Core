import { createDecorator } from './create-decorator';
import { User, Message, GuildMember } from 'discord.js';
import { ExecutionContext } from '../../interfaces/execution-context.interface';

const authorArg = (context: ExecutionContext) =>
  context.getArgs()[2] instanceof User
    ? context.getArgs()[2]
    : context.getArgs()[1] instanceof User
    ? context.getArgs()[1]
    : context.getArgs()[0] instanceof User
    ? context.getArgs()[0]
    : undefined;

const messageArg = (context: ExecutionContext) =>
  context.getArgs()[2] instanceof Message
    ? context.getArgs()[2].author
    : context.getArgs()[1] instanceof Message
    ? context.getArgs()[1].author
    : context.getArgs()[0] instanceof Message
    ? context.getArgs()[0].author
    : undefined;

const memberArg = (context: ExecutionContext) =>
  context.getArgs()[2] instanceof GuildMember
    ? context.getArgs()[2].user
    : context.getArgs()[1] instanceof GuildMember
    ? context.getArgs()[1].user
    : context.getArgs()[0] instanceof GuildMember
    ? context.getArgs()[0].user
    : undefined;

export const Author = createDecorator(
  (_, context) =>
    authorArg(context) || messageArg(context) || memberArg(context),
);
