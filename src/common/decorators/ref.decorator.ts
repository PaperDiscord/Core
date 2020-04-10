import { Inject } from '../../injector/inject.decorator';

/**
 * Injects the Instance of a variable
 *
 * @publicApi
 */
export const Ref = Inject({ injectInstance: true });
