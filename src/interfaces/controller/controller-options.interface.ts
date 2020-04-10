/**
 * @publicApi
 */
export type ControllerOptions = string | ControllerOptionsObject;

/**
 * @publicApi
 */
export interface ControllerOptionsObject {
  baseCommand?: string;
}

export interface ControllerOptionsData {
  data: ControllerOptionsObject;
}
