import { ControllerWrapper } from '../controller-wrapper';
import { ExecutionContext } from '../../interfaces/execution-context.interface';
import { CommandListenerOptionsData } from '../../interfaces/controller/command-listener-options.interface';

export class CommandHandler {
  constructor(
    public readonly controller: ControllerWrapper,
    private readonly _data: CommandListenerOptionsData,
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

  public shouldUseBaseCommand() {
    return this._data.data.useBaseCommand ?? true;
  }

  public async call(context: ExecutionContext) {
    return this.controller.instanceWrapper.call(this.methodName, {
      context,
      findArgs: true,
    });
  }
}
