import { PaperContainer } from '../paper-container';
import {
  CONSTRUCTOR_PARAMTYPES,
  PROPERTY_TYPE,
  PROPERTY_DATA,
  PROVIDER_METADATA,
  COMMANDER_COMMAND_PROPERTIES,
} from '../../constants';
import { OnAllProvidersInit, Type } from '../interfaces';
import { CommandOptions } from '../commands/command';
import { ICommander } from '../commands/commander';
import { CommandProvider } from '../commands/command.provider';

const constructorParamTypes = (o: Type): Type[] =>
  Reflect.getMetadata(CONSTRUCTOR_PARAMTYPES, o) || [];

export class Provider implements OnAllProvidersInit {
  private _hasBeenInitialized = false;
  private _instance: any = undefined;

  constructor(
    public readonly container: PaperContainer,
    public readonly classPrototype: Type,
  ) {}

  public get hasBeenInitialized() {
    return this._hasBeenInitialized;
  }

  public constructorParamTypes() {
    return constructorParamTypes(this.classPrototype);
  }

  public async setupContructorParams() {
    this.constructorParamTypes().forEach(param => {
      if (this.container.providers.has(param)) return;
      const paramProvider = new Provider(this.container, param);

      this.container.providers.set(param, paramProvider);
      paramProvider.setupContructorParams();
    });
  }

  public async initialize() {
    this._hasBeenInitialized = true;

    this._instance = new this.classPrototype(
      ...this.constructorParamTypes().map(
        v => this.container.providers.get(v).instance || null,
      ),
    );

    return this;
  }

  public get instance() {
    return this._instance;
  }

  public isCommander() {
    return (
      Reflect.getMetadata(PROVIDER_METADATA, this.classPrototype)?.type ===
      'Commander'
    );
  }

  public initCommander() {
    /*
        const commandFunctions: Array<{
      data: CommandOptions;
      func: any;
    }> = Reflect.getMetadataKeys(this.provider)
      .filter(
        (key: string) =>
          key.indexOf(COMMANDER_COMMAND_PROPERTIES('').split(':')[0]) > -1,
      )
      .map((key: string) => ({
        data: Reflect.getMetadata(
          COMMANDER_COMMAND_PROPERTIES(key),
          this.provider,
        ),
        func: this.instance[key],
      }));

      commandFunctions.forEach()*/
    const commander: ICommander = Reflect.getMetadata(
      PROVIDER_METADATA,
      this.classPrototype,
    );
    if (!commander?.options?.baseCommand) {
      throw Error('Invalid Base Command...');
    }

    const baseCommand = commander?.options?.baseCommand.split(' ')[0];
    if (!this.container.commands.has(baseCommand)) {
      this.container.commands.set(
        baseCommand,
        new CommandProvider(this.container, baseCommand),
      );
    }

    this.container.commands.get(baseCommand).addProvider(this);
  }

  onAllProvidersInit() {}
}
