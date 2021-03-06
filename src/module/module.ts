import { PaperContainer } from '../paper/container';
import { v4 as uuid } from 'uuid';
import { Provider } from '../interfaces/module/provider';
import {
  ModuleOptions,
  ModuleMetadata,
} from '../interfaces/module/module.interface';
import {
  PAPER_MODULE_OPTIONS,
  USE_MODULE,
  CONTROLLER_OPTIONS,
} from '../contants';
import { Type } from '../interfaces/type.interface';
import { Logger, LoggerLevel } from '../utils/logger';
import { Module as ModuleDecorator } from './module.decorator';
import { InstanceManager } from '../injector/instance-manager';
import { ControllerWrapper } from '../controller/controller-wrapper';

export class Module {
  private logger = new Logger(this.moduleClass.name);

  public readonly id = uuid();
  private _metadata: ModuleMetadata;

  public readonly imports: Set<Provider<any>>;
  public readonly exports: Set<Provider<any>>;
  public readonly controlers: Set<Provider<any>>;
  public readonly providers: Set<Provider<any>>;

  private _isModule = true;
  private _loaded = false;

  constructor(
    private readonly container: PaperContainer,
    public readonly moduleClass: Type<any>,
    public readonly parentModule: Module = null,
  ) {
    const metadata: ModuleMetadata = Reflect.getMetadata(
      PAPER_MODULE_OPTIONS,
      moduleClass,
    );

    if (!metadata) {
      this._isModule = false;
      return;
    }

    this._metadata = metadata;
    this.imports = new Set(metadata.data.imports || []);
    this.controlers = new Set(metadata.data.controllers || []);
    this.exports = new Set(metadata.data.exports || []);
    this.providers = new Set(metadata.data.exports || []);
  }

  public get isModule() {
    return this._isModule;
  }

  public get isDoneLoading() {
    return !this._isModule ? false : this._loaded;
  }

  public async init() {
    this.logger.verbose(`Starting to Initialize ${this.moduleClass.name}`);
    // Initialize the rest of the Modules first
    await this.loadImportedModules();
    await this.loadProviders();
    await this.loadControllers();

    this.container.modules.set(this.moduleClass, this);
    this.logger.verbose(`Done Initializing ${this.moduleClass.name}`);

    this._loaded = true;
  }

  private async loadControllers() {
    return Promise.all(
      Array.from(this.controlers.values())
        .map((provider) =>
          this.container.providers.get(
            typeof provider === 'function' ? provider : provider['useClass'],
          ),
        )
        .filter(
          (instanceManager) =>
            instanceManager &&
            instanceManager.classReflector.get(CONTROLLER_OPTIONS),
        )
        .map(async (instanceManager) =>
          new ControllerWrapper(
            this.container,
            await instanceManager.get(),
          ).init(),
        ),
    );
  }

  private async loadProviders() {
    Array.from([...this.providers.values(), ...this.controlers])
      .filter(
        (provider) =>
          this.getClassFromProvider(provider, 'useClass') &&
          !this.container.providers.has(
            this.getClassFromProvider(provider, 'useClass'),
          ),
      )
      .forEach((provider) => {
        this.container.providers.set(
          this.getClassFromProvider(provider, 'useClass'),
          new InstanceManager(this.container, provider),
        );
      });
  }

  private getClassFromProvider(
    provider: Provider,
    classPath = 'useModule',
  ): Type<any> {
    return typeof provider === 'function' ? provider : provider['useModule'];
  }

  private async loadImportedModules() {
    const path: any[] = [this.moduleClass];
    for (const _moduleClassToCheck of this.imports.values()) {
      if (!_moduleClassToCheck) {
        this.logger.error(
          `Could not load a module. Perhaps circular dependency is happening?`,
        );
        continue;
      }

      if (
        typeof _moduleClassToCheck !== 'function' &&
        (_moduleClassToCheck?.provide !== USE_MODULE ||
          !_moduleClassToCheck['useModule'])
      ) {
        this.logger.error(
          _moduleClassToCheck['useModule']
            ? `Failed to load module ${_moduleClassToCheck['useModule'].name}`
            : `Failed to load a module. Please make sure you are using the constant 'USE_MODULE' provider`,
        );
        continue;
      }

      const moduleClassToImport = this.getClassFromProvider(
        _moduleClassToCheck,
        'useModule',
      );

      const module =
        this.container.modules.get(moduleClassToImport) ||
        this.container.modules
          .set(
            moduleClassToImport,
            new Module(
              this.container,
              typeof _moduleClassToCheck === 'function'
                ? _moduleClassToCheck
                : _moduleClassToCheck['useModule'],
            ),
          )
          .get(moduleClassToImport);

      if (module.isDoneLoading) {
        continue;
      }

      path.push(module);

      if (
        Array.from(module.imports).some((imp) =>
          imp
            ? (typeof imp === 'function' && imp === this.moduleClass) ||
              imp['useModule'] === this.moduleClass
            : true,
        )
      ) {
        this.logger.error(
          `Failed to load Module ${
            this.moduleClass.name
          } - Circular Dependency Found: ${path
            .map((m) => m.name || m?.moduleClass.name)
            .join(' <--> ')}`,
        );

        path.pop();
        continue;
      }

      this.logger.verbose(`Loading imported module ${module.moduleClass.name}`);
      await module.init();
      this.logger.verbose(`Loaded Module ${module.moduleClass.name}`);

      path.pop();
    }
  }
}
