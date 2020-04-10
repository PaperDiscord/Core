import { PaperContainer } from '../paper/container';
import { EventWrapper } from './event-wrapper';
import { EventOptionsData } from '../interfaces/events/event-options';
import { ExecutionContext } from '../interfaces/execution-context.interface';

export class EventHandler {
  constructor(
    public readonly container: PaperContainer,
    public readonly eventWrapper: EventWrapper,
    private readonly _data: EventOptionsData,
  ) {}

  public get methodName() {
    return this._data.functionName;
  }

  public get method() {
    return this._data.function;
  }

  public get data() {
    return this._data.data;
  }

  public async call(context: ExecutionContext) {
    this.eventWrapper.instanceWrapper.call(this.methodName, {
      context,
      findArgs: true,
    });
  }

  public get event() {
    return this._data?.data?.event;
  }
}
