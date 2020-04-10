/**
 * @publicApi
 */
export enum ErrorCodes {
  Unknown = 0,
  ReflectorAddNotArray = 1,
  InstanceWrapperInvalidMethod = 2,
  InstanceWrapperNoFunctionInjects = 3,
  GuardDoesNotHaveCanActivate = 4,
  GuardCannotActivate = 5,
}

/**
 * @publicApi
 */
export class CustomError {
  protected data: { message?: string; code?: ErrorCodes };
  public message: string;

  constructor(data: string | { message?: string; code?: ErrorCodes }) {
    if (
      typeof data === 'string' ||
      typeof data === 'bigint' ||
      typeof data === 'boolean' ||
      typeof data === 'number'
    ) {
      this.message = String(data);
      this.data = { message: data };
    }

    this.data = data as any;
  }

  public get code() {
    return this.data?.code || ErrorCodes.Unknown;
  }
}
