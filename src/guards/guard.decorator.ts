import { CustomError, ErrorCodes } from '../utils/error';
import { IS_CLASS_A_GUARD } from '../contants';

/**
 * @publicApi
 */
export const Guard = (): ClassDecorator => (target) => {
//   if (!target.prototype.canActive)
//     throw new CustomError({
//       code: ErrorCodes.GuardDoesNotHaveCanActivate,
//       message: `The Guard ${target.name} does not have the method 'canActivate'`,
//     });

  Reflect.defineMetadata(IS_CLASS_A_GUARD, true, target);
};
