import { CustomError, ErrorCodes } from '../utils/error';
import { SET_METADATA_PREFIX } from '../contants';

export class Reflector {
  constructor(public readonly target: any) {}

  public set(key: string, value: any) {
    Reflect.defineMetadata(key, value, this.target);
    return this;
  }

  public add(key: string, value: any) {
    const prevValues = this.get(key, []);

    if (!Array.isArray(prevValues)) {
      throw new CustomError({
        message: `Could not add value to non-array item. Key: ${key}`,
        code: ErrorCodes.ReflectorAddNotArray,
      });
    }

    prevValues.push(value);
    return this.set(key, prevValues);
  }

  public get<Result = any>(key: string, def?: any): Result {
    return (
      Reflect.getMetadata(key, this.target) ??
      Reflect.getMetadata(`${SET_METADATA_PREFIX}${key}`, this.target) ??
      def
    );
  }
}
