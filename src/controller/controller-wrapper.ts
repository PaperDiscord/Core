import 'reflect-metadata';

import { PaperContainer } from '../paper/container';
import { InstanceWrapper, InstanceManager } from '../injector/instance-manager';
import { Reflector } from '../reflector/reflector';
import { CONTROLLER_COMMAND_METHODS, CONTROLLER_OPTIONS } from '../contants';
import { Command } from './command/command.decorator';
import { CommandListenerOptionsData } from '../interfaces/controller/command-listener-options.interface';
import { CommandHandler } from './command/handler';
import { ControllerOptionsData } from '../interfaces/controller/controller-options.interface';
import { Logger, LoggerLevel } from '../utils/logger';
import { Controller } from './controller.decorator';
import { PaperDiscordFactory } from '../paper/factory';
import { Module } from '../module/module.decorator';
import { App } from '../common/decorators/app.decorator';
import { PaperApp } from '../paper/app';
import { Ctx } from '../common/decorators/ctx.decorator';
import { ExecutionContext } from '../interfaces/execution-context.interface';
import { SetMetadata } from '../common/decorators/set-metadata.decorator';

let i = 0;

export class ControllerWrapper {
  private readonly logger = new Logger(
    this.instanceWrapper.manager.getProviderClass().name + 'Controller' ??
      `UnknownController`,
  );
  private readonly reflector = this.instanceWrapper.reflector;
  private readonly classReflector = this.instanceWrapper.classReflector;

  constructor(
    public readonly container: PaperContainer,
    public readonly instanceWrapper: InstanceWrapper,
  ) {
    this.logger.info(`Calling ${i}`);
    i++;
  }

  private getControllerOptionsData() {
    return this.classReflector.get<ControllerOptionsData>(CONTROLLER_OPTIONS);
  }

  public get baseCommand() {
    return this.getControllerOptionsData().data.baseCommand || '';
  }

  public async init() {
    await this.setupCommandListeners();

    this.container.controllers.set(
      this.instanceWrapper.manager.getProviderClass(),
      this,
    );
  }

  private async setupCommandListeners() {
    const reflector = new Reflector(this.instanceWrapper.instance);

    const commandMethods =
      reflector.get<CommandListenerOptionsData[]>(CONTROLLER_COMMAND_METHODS) ??
      [];

    commandMethods.forEach((data) => {
      const handler = new CommandHandler(this, data);

      const handlerCommandStr = `${
        handler.shouldUseBaseCommand() ? this.baseCommand + ' ' : ''
      }${handler.data.command}`
        .replace(/  +/, '')
        .trim();

      if (this.container.commandHandlers.has(handlerCommandStr)) {
        const currentMethodPath = `${
          this.instanceWrapper.manager.getProviderClass().name
        }.${handler.methodName.toString()}`;
        const otherMethod = this.container.commandHandlers.get(
          handlerCommandStr,
        );
        const otherMethodPath = `${
          otherMethod.controller.instanceWrapper.manager.getProviderClass().name
        }.${otherMethod.methodName.toString()}`;
        this.logger.error(
          `Could not map '${handlerCommandStr}' to ${currentMethodPath}. It is mapped to ${otherMethodPath}`,
        );

        return;
      }

      this.container.commandHandlers.set(handlerCommandStr, handler);
    });
  }
}
