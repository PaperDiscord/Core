import { PaperContainer } from './container';
import { Type } from '../interfaces/type.interface';
import { Module } from '../module/module.decorator';

class PaperDiscordFactoryStatics {
  public static async create(module: Type<any>) {
    const container = await PaperContainer.create(module);

    return container.getApp();
  }

  private constructor() {}
}
/**
 * @publicApi
 */
export const PaperDiscordFactory = PaperDiscordFactoryStatics;
