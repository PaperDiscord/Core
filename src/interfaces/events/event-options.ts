import { ContextSource as Event } from '../../context/context-source';

export { Event };

/**
 * @publicApi
 */
export type EventOptions = Event | EventOptionsObject;

/**
 * @publicApi
 */
export interface EventOptionsObject {
  event: Event;
}

export interface EventOptionsData {
  function: Function;
  functionName: string | symbol;
  data: EventOptionsObject;
}
