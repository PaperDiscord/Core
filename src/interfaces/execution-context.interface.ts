import { User, Message, Channel, Client } from 'discord.js';
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
}

/**
 * @publicApi
 */
export interface CommandExecutionContext {
  getAuthor(): User;

  getMessage(): Message;

  getChannel(): Channel;
}
