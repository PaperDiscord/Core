import {
  EventOptions,
  EventOptionsData,
} from '../interfaces/events/event-options';
import { Reflector } from '../reflector/reflector';
import { EVENT_METHOD_OPTIONS } from '../contants';

type Decorator = MethodDecorator;

export const OnEvent = (options: EventOptions): Decorator => (
  target,
  property,
  descriptor,
) => {
  if (typeof options === 'string') {
    options = { event: options };
  }

  const reflector = new Reflector(target);

  reflector.add(EVENT_METHOD_OPTIONS, <EventOptionsData>{
    data: options,
    function: target[property],
    functionName: property,
  });
};
