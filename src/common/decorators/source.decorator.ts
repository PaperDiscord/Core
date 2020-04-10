import { createDecorator } from './create-decorator';

export const Source = createDecorator((_, context) => context.source);
