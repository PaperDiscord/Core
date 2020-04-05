import { ContextId } from './context-id.interface';
import { v4 as uuid } from 'uuid';
import { Context } from './context';
import { ContextSource } from './context-source';
import { PaperApp } from '../paper/app';
import { InstanceWrapper } from '../injector/instance-manager';

export class ContextCreator<Args extends Array<any> = []> implements ContextId {
  public readonly id = uuid();
  private args: Args;
  private source: ContextSource = ContextSource.Unknown;
  public app: PaperApp;
  public class: any;
  public classInstance: any;
  public instance: InstanceWrapper<any>;
  public handler: Function;

  public getSource() {
    return this.source;
  }

  public setSource(source: ContextSource) {
    this.source = source;
    return this;
  }

  public setArgs(args: Args) {
    this.args = args;
    return this;
  }

  public getArgs() {
    return this.args;
  }

  public create() {
    return new Context<Args>(
      this,
      this.app,
      this.id,
      this.source,
      this.args,
      this.handler,
      this.instance,
    );
  }
}
