import { createDecorator } from './create-decorator';

/**
 * @publicApi
 */
export const App = createDecorator((_, context) => context.getApp());
