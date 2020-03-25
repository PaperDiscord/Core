import { Context } from './context';
import { Message } from 'discord.js';
import { Handler } from '../commands/command-handler';

export class CommandContext {
  private _commandParam: { [param: string]: string };
  private _handler: Handler;

  constructor(protected readonly context: Context) {}

  public get message(): Message {
    return this.context.contextArgs[0];
  }

  public arg(index: number, def?: string) {
    return this.args()[index] || def;
  }

  public get author() {
    return this.message.author;
  }

  public args() {
    return this.message.content
      .replace(/ +/, ' ')
      .split(' ')
      .slice(1);
  }

  public fullCommand() {
    return this.message.content.replace(/ +/, ' ');
  }

  public _setCommandParams(params: { [param: string]: string }) {
    this._commandParam = params;
    return this;
  }

  public _setHandler(handler: Handler) {
    this._handler = handler;
  }

  public getCommandParam(parameter: string, def?: string) {
    return this._commandParam[parameter] || def;
  }

  public getCommandParams() {
    return this._commandParam;
  }
}
