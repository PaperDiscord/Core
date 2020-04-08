import { Logger } from '../utils/logger';
import { PaperContainer } from '../paper/container';
import { InstanceWrapper } from '../injector/instance-manager';
import { EVENT_METHOD_OPTIONS } from '../contants';
import { EventOptionsData } from '../interfaces/events/event-options';
import { EventHandler } from './event-handler';

export class EventWrapper {
  private readonly logger = new Logger(
    this.instanceWrapper.manager.getProviderClass().name + 'EventWrapper' ??
      `UnknownEventWrapper`,
  );
  private readonly reflector = this.instanceWrapper.reflector;
  private readonly classReflector = this.instanceWrapper.classReflector;

  constructor(
    public readonly container: PaperContainer,
    public readonly instanceWrapper: InstanceWrapper,
  ) {}

  private getEventMethodsOption() {
    return this.reflector.get<EventOptionsData[]>(EVENT_METHOD_OPTIONS) || [];
  }

  public async init() {
    const eventMethods = this.getEventMethodsOption();

    eventMethods.forEach((data) => {
      const handler = new EventHandler(this.container, this, data);
      this.logger.info(
        `Mapped ${handler.event} to ${
          this.instanceWrapper.manager.getProviderClass().name
        }.${handler.methodName.toString()}`,
      );
      if (!this.container.eventHandlers.has(handler.event))
        return this.container.eventHandlers.set(handler.event, [handler]);

      this.container.eventHandlers.set(handler.event, [
        ...this.container.eventHandlers.get(handler.event),
        handler,
      ]);
    });
  }
}
