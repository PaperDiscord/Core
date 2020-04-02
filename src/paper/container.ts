import { Client } from 'discord.js';
import { Module } from '../module/module';
import { Provider } from '../interfaces/module/provider';
import { Context } from '../context/context';

export class PaperContainer {
  private readonly modules = new Set<Module>();
  public readonly providers: Map<Provider, any> = new Map();
  public readonly contextProviders: Map<Context, any> = new Map();

  private constructor(private readonly mainModule: Module) {
    this.modules.add(mainModule);
  }

  private async init() {
    for (const module of this.modules) {
      await module.init();
    }
  }
}
