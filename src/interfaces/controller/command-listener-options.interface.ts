/**
 * @publicApi
 */
export type CommandListenerOptions = string | CommandListenerOptionsObject;

/**
 * @publicApi
 */
export interface CommandListenerOptionsObject {
  command: string;
  useBaseCommand?: boolean;
}

export interface CommandListenerOptionsData {
  function: Function;
  target: Object;
  functionName: string | symbol;
  data: CommandListenerOptionsObject;
}
