import { MODULE_METADATA } from '../constants';
import { PaperModuleOptions } from './module';
import { PaperContainer } from './paper-container';
import { PaperApp } from './paper-app';
import { Type } from './interfaces';

class PaperFactoryStatics {
  async create(module: Type) {
    const metadata: PaperModuleOptions = Reflect.getMetadata(
      MODULE_METADATA,
      module,
    );

    if (!metadata) {
      throw Error('Invalid Module');
    }

    const container = await PaperContainer.create(module);

    return container.app;
  }
}

export const PaperFactory = new PaperFactoryStatics();
