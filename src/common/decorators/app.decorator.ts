import { createParamDecorator } from '../../core/decorators';

export const App = createParamDecorator((_, context) => 'hi');
