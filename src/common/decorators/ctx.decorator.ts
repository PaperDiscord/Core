import { createDecorator } from './create-decorator';

/**
 * @publicApi
 */
export const Ctx = createDecorator((_, context) => context);
