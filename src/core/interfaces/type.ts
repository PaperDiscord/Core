export interface Type<T = any, Params extends Array<any> = any[]>
  extends Object {
  new (...args: Params): T;
}
