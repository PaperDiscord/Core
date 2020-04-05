import { createDecorator } from './create-decorator';

export const Ctx = createDecorator((_, context) => context);
