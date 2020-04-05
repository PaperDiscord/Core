import { ContextId } from './context-id.interface';
import { ContextSource } from './context-source';
import { PaperApp } from '../paper/app';
import {
  ExecutionContext,
  CommandExecutionContext,
} from '../interfaces/execution-context.interface';
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

  private set(functions: any = {}) {
    return Object.assign(this, functions);
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

  public getClass() {
    return this.instanceWrapper.manager.getProviderClass();
  }

  public getHandler() {
    return this.handler;
  }
}
