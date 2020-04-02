import { PaperContainer } from '../paper/container';
import { v4 as uuid } from 'uuid';
import { Provider } from '../interfaces/module/provider';
import {
  ModuleOptions,
  ModuleMetadata,
} from '../interfaces/module/module.interface';
import { PAPER_MODULE_OPTIONS } from '../contants';
import { Type } from '../interfaces/type.interface';

export class Module {
  public readonly id = uuid();
  private _metadata: ModuleMetadata;

  private readonly _imports: Set<Provider<any>>;
  private readonly _exports: Set<Provider<any>>;
  private readonly _controllers: Set<Provider<any>>;
  private readonly _providers: Set<Provider<any>>;

  constructor(private readonly container: PaperContainer, module: Type<any>) {
    const metadata: ModuleMetadata = Reflect.getMetadata(
      PAPER_MODULE_OPTIONS,
      module,
    );

    this._metadata = metadata;
    this._imports = new Set(metadata.data.imports);
    this._controllers = new Set(metadata.data.controllers);
    this._exports = new Set(metadata.data.exports);
    this._providers = new Set(metadata.data.exports);
  }

  public async init() {}
}
