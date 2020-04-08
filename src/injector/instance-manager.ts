import { v4 as uuid } from 'uuid';
import { Type } from '../interfaces/type.interface';
import {
  Provider,
  ValueProvider,
  ClassProvider,
} from '../interfaces/module/provider';
import { PaperContainer } from '../paper/container';
import { Scope } from '../interfaces/scope-options.interface';
import { Context } from '../context/context';
import { ContextId } from '../context/context-id.interface';
import { Injector } from './injector';
import { CustomError, ErrorCodes } from '../utils/error';
import { Reflector } from '../reflector/reflector';
import {
  InjectMethodData,
  InjectExecutor,
  InjectPropertyData,
} from '../interfaces/injector/inject-options.interface';
import {
  INSTANCE_WRAPPER_METHOD_PARAMS,
  INSTANCE_WRAPPER_PROPERTY_INJECTS,
  EVENT_METHOD_OPTIONS,
  INSTANCE_WRAPPER_METHOD_GUARD,
  INSTANCE_WRAPPER_CLASS_GUARD,
  SERVICE_DATA,
  SCOPE_DATA,
} from '../contants';
import { Inject } from './inject.decorator';
import { ContextSource } from '../context/context-source';
import { Logger } from '../utils/logger';
import { ContextCreator } from '../context/context-creator';
import { PaperDiscordFactory } from '../paper/factory';
import { Module } from '../module/module.decorator';
import { ExecutionContext } from '../interfaces/execution-context.interface';
import { EventWrapper } from '../event/event-wrapper';
import { CanActivate } from '../interfaces/guards/can-activate.interface';
import {
  UseGuardsData,
  UseGuardsOptions,
} from '../interfaces/guards/use-guards-options';
import {
  ServiceOptions,
  ServiceData,
} from '../interfaces/service/service-options.interface';

export class InstanceManager<T = any> {
  private instances: Map<ContextId, InstanceWrapper> = new Map();
  private instanceWrapper: InstanceWrapper;
  public readonly classReflector = new Reflector(this.provider);
  public readonly injector = new Injector(this.provider);

  constructor(
    public readonly container: PaperContainer,
    public readonly provider: Provider,
  ) {}

  public async get(
    context: ContextId = { id: '*' },
  ): Promise<InstanceWrapper<T> | T> {
    if (typeof this.provider === 'function') {
      return this._getFunction(context);
    } else if (this.provider['useClass']) {
      return this._getClass(context);
    } else if (this.provider['useValue']) {
      return this._getValue(context);
    }
  }

  public getProviderClass() {
    if (typeof this.provider === 'function') {
      return this.provider;
    } else if (this.provider['useClass']) {
      return this.provider['useClass'];
    }
  }

  private async _getInstance(
    context: ContextId,
    classProvider: any,
    scope: Scope,
  ) {
    switch (scope) {
      case Scope.DEFAULT:
        if (this.instanceWrapper) {
          return this.instanceWrapper;
        }

        const paramsForConstructor = this.injector
          .getConstructorParams()
          .map((param) =>
            this.container ? this.container.providers.get(param) : null,
          );

        const instance = this.injector.instantiate(paramsForConstructor);
        const instanceWrapper = new InstanceWrapper<T>(this, instance);
        this.instanceWrapper = instanceWrapper;
        return await instanceWrapper.init();
      case Scope.TRANSIENT: {
        const paramsForConstructor = this.injector
          .getConstructorParams()
          .map((param) => this.container.providers.get(param));

        const instance = this.injector.instantiate(paramsForConstructor);
        const instanceWrapper = new InstanceWrapper<T>(this, instance);
        this.instances.set(context, instanceWrapper);
        return instanceWrapper.init();
      }
      case Scope.PER_PROCESS: {
        if (this.instances.has(context)) return this.instances.get(context);
        const paramsForConstructor = this.injector
          .getConstructorParams()
          .map((param) => this.container.providers.get(param));

        const instance = this.injector.instantiate(paramsForConstructor);
        const instanceWrapper = new InstanceWrapper<T>(this, instance);
        this.instances.set(context, instanceWrapper);
        return instanceWrapper.init();
      }
    }
  }

  private async _getFunction(
    context: ContextId,
    provider = this.provider as Type<T>,
  ): Promise<InstanceWrapper> {
    const reflector = new Reflector(provider);
    return this._getInstance(
      context,
      provider,
      reflector.get(SCOPE_DATA) ||
        reflector.get<ServiceData>(SERVICE_DATA)?.data?.scope ||
        Scope.DEFAULT,
    );
  }

  private async _getClass(context: ContextId): Promise<InstanceWrapper> {
    const provider = this.provider as ClassProvider<T>;

    const scope =
      provider.scope ||
      this.classReflector.get<ServiceOptions>(SERVICE_DATA).scope ||
      Scope.DEFAULT;

    switch (scope) {
      case Scope.DEFAULT:
        return this._getFunction(context, provider.useClass);
      case Scope.TRANSIENT: {
        const paramsForConstructor = this.injector
          .getConstructorParams()
          .map((param) => this.container.providers.get(param));

        const instance = this.injector.instantiate(paramsForConstructor);
        const instanceWrapper = new InstanceWrapper<T>(this, instance);
        this.instances.set(context, instanceWrapper);
        return instanceWrapper.init();
      }
      case Scope.PER_PROCESS: {
        if (this.instances.has(context)) return this.instances.get(context);
        const paramsForConstructor = this.injector
          .getConstructorParams()
          .map((param) => this.container.providers.get(param));

        const instance = this.injector.instantiate(paramsForConstructor);
        const instanceWrapper = new InstanceWrapper<T>(this, instance);
        this.instances.set(context, instanceWrapper);
        return instanceWrapper.init();
      }
    }
  }

  private _getValue(context: ContextId) {
    return (this.provider as ValueProvider<T>).useValue;
  }
}

export class InstanceWrapper<T = any> {
  private readonly id = uuid();
  private readonly logger = new Logger(
    `${this.manager.getProviderClass().name}Instance:${this.id}`,
  );

  public readonly reflector = new Reflector(this.instance);
  public readonly classReflector = new Reflector(
    this.manager.getProviderClass(),
  );

  constructor(
    public readonly manager: InstanceManager,
    public readonly instance: T,
    private readonly contextId?: ContextId,
  ) {}

  public async init() {
    const contextCreator = new ContextCreator();
    contextCreator.setSource(ContextSource.PropertySetter);
    contextCreator.app = this.manager.container.getApp();

    const context = contextCreator.create();

    const properties =
      this.reflector.get<InjectPropertyData[]>(
        INSTANCE_WRAPPER_PROPERTY_INJECTS,
      ) || [];

    const valuesForProperties = await Promise.all(
      properties.map((property) => this.injectProperty(property, context)),
    );

    valuesForProperties.forEach(({ data, value }) => {
      this.logger.info(
        `Setting up the Property: ${data.property.toString()} to be equal to ${String(
          value,
        )}`,
      );
      if (value) this.instance[data.property] = value;
    });

    if (this.reflector.get(EVENT_METHOD_OPTIONS)) {
      await new EventWrapper(this.manager.container, this).init();
    }

    return this;
  }

  private async injectProperty(
    propertyData: InjectPropertyData,
    context: Context,
  ) {
    if (propertyData.options?.injectInstance) {
      const instanceManager = this.manager.container.providers.get(
        propertyData.type,
      );

      if (!instanceManager) {
        return {
          data: propertyData,
          value: undefined,
        };
      }

      const result = await instanceManager.get(context);

      if (result instanceof InstanceWrapper) {
        return {
          data: propertyData,
          value: result.instance,
        };
      }

      return {
        data: propertyData,
        value: result,
      };
    }

    const propertyResolver: InjectExecutor =
      propertyData.options?.executors?.property ||
      propertyData.options?.executors?.default;

    if (!propertyResolver) {
      return {
        data: propertyData,
        value: undefined,
      };
    }

    return {
      data: propertyData,
      value: await propertyResolver(propertyData.options?.input, context),
    };
  }

  private async getGuardInstance(guard: Type<any>, context: ExecutionContext) {
    if (this.manager.container.providers.has(guard)) {
      return this.manager.container.providers.get(guard).get(context);
    }

    const instanceManager = new InstanceManager(this.manager.container, guard);

    this.manager.container.providers.set(guard, instanceManager);

    const { instance } = await instanceManager.get(context);

    return instance;
  }

  private async callGuards(method: string | symbol, context: ExecutionContext) {
    /* Run Guards */
    const globalGuards: CanActivate[] = [];
    const classGuards: CanActivate[] = await Promise.all(
      this.classReflector
        .get<Type<any>[]>(INSTANCE_WRAPPER_CLASS_GUARD, [])
        .filter((guard) => guard)
        .flat()
        .filter((guard, index, arr) => arr.indexOf(guard) === index)
        .map((guard) => this.getGuardInstance(guard, context)),
    );

    const methodGuards: CanActivate[] = await Promise.all(
      this.reflector
        .get<UseGuardsData[]>(INSTANCE_WRAPPER_METHOD_GUARD, [])
        .filter((guard) => guard.functionName === method)
        .map((data) => data.data)
        .flat()
        .filter((guard, index, arr) => arr.indexOf(guard) === index)
        .map((guard) => this.getGuardInstance(guard, context)),
    );

    for (const guard of globalGuards) {
      if (!(await guard.canActivate(context)))
        throw new CustomError({
          code: ErrorCodes.GuardCannotActivate,
        });
    }

    for (const guard of classGuards) {
      if (!(await guard.canActivate(context)))
        throw new CustomError({
          code: ErrorCodes.GuardCannotActivate,
        });
    }

    for (const guard of methodGuards) {
      if (!(await guard.canActivate(context)))
        throw new CustomError({
          code: ErrorCodes.GuardCannotActivate,
        });
    }
  }

  public async call(
    method: string | symbol,
    options: {
      context: ExecutionContext;
      findArgs?: boolean;
      args?: any[];
    },
  ) {
    if (typeof this.instance[method] !== 'function') {
      throw new CustomError({
        code: ErrorCodes.InstanceWrapperInvalidMethod,
        message: `The Method ${method.toString()} does not exist on ${
          this.manager.getProviderClass().name
        }`,
      });
    }

    let args = options.args || [];
    if (options.findArgs) {
      args = await this.getArgs(method, options.context);
    }

    try {
      await this.callGuards(method, options.context);

      return await this.instance[method](...args);
    } catch (e) {
      this.logger.child(`Guards`).info(`A Guard has returned False`);
    }
  }

  private async getArgs(method: string | symbol, context: ExecutionContext) {
    const methodInjects = this.reflector
      .get<InjectMethodData[]>(INSTANCE_WRAPPER_METHOD_PARAMS, [])
      .filter((data) => data.functionName === method);

    const injects = await Promise.all(
      methodInjects.map((inject) => this.getInject(inject, context)),
    );

    return injects || [];
  }

  private getInject(inject: InjectMethodData, context: ExecutionContext) {
    const contextSource = context?.source ?? ContextSource.Unknown;
    if (contextSource.startsWith(ContextSource.DiscordEventBase)) {
      const eventResolver = (inject.options?.executors?.events?.discord || {})[
        contextSource.replace(ContextSource.DiscordEventBase, '')
      ];
      const injectResolver: InjectExecutor =
        eventResolver ||
        inject.options?.executors?.events?.discord?.default ||
        inject.options?.executors?.default;
      return injectResolver
        ? injectResolver(inject?.options?.input, context)
        : undefined;
    } else if (contextSource === ContextSource.PaperCommand) {
      const injectResolver: InjectExecutor =
        inject.options?.executors?.command ||
        inject.options?.executors?.default;

      return injectResolver
        ? injectResolver(inject?.options?.input, context)
        : undefined;
    } else if (contextSource === ContextSource.PropertySetter) {
      const injectResolver: InjectExecutor =
        inject.options?.executors?.property ||
        inject.options?.executors?.default;

      return injectResolver
        ? injectResolver(inject?.options?.input, context)
        : undefined;
    } else {
      this.logger
        .child(`Context:${context?.id ?? 'UnknownId'}`)
        .error(
          `Could not get a valid inject resolver for execution context source: '${contextSource}'`,
        );
      return undefined;
    }
  }
}
