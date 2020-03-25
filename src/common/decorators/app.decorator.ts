import { createParamDecorator } from '../../core/decorators';

export const App = createParamDecorator(context => context.getApp());
