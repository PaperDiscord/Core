/**
 * @publicApi
 */
export enum Scope {
  /**
   * One instance exists per entire application
   *
   * @publicApi
   */
  DEFAULT,

  /**
   * A new private instance is instantiated every time
   */
  TRANSIENT,

  /**
   * A new instance is instantiated at the start of the processing pipeline
   */
  PER_PROCESS,
}

export interface ScopeOptions {
  scope?: Scope;
}
