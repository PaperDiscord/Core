import { Logger } from '../utils/logger';
import { PaperContainer } from '../paper/container';
import { InstanceWrapper, InstanceManager } from '../injector/instance-manager';
import { EVENT_METHOD_OPTIONS } from '../contants';
import { EventOptionsData, Event } from '../interfaces/events/event-options';
import { ExecutionContext } from '../interfaces/execution-context.interface';
import { EventHandler } from './event-handler';
import { PaperDiscordFactory } from '../paper/factory';
import { Module } from '../module/module.decorator';
import { Controller } from '../controller/controller.decorator';
import { OnEvent } from './on-event.decorator';
import { Command } from '../controller/command/command.decorator';
import { Source } from '../common/decorators/source.decorator';
import { Author } from '../common/decorators/author.decorator';
import { User, Channel, Message } from 'discord.js';
import { Guard } from '../guards/guard.decorator';
import { CanActivate } from '../interfaces/guards/can-activate.interface';
import { UseGuards } from '../guards/use-guards.decorator';
import { isMainThread } from 'worker_threads';

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
