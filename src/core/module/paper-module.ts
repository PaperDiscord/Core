import 'reflect-metadata';
import { MODULE_METADATA, PROPERTY_TYPE } from '../../constants';

export const PaperModuleInit = (
  metadata: PaperModuleOptions = {},
): ClassDecorator => target => {
  Reflect.defineMetadata(
    MODULE_METADATA,
    { dependencies: [], providers: [], ...metadata },
    target,
  );
};

export interface PaperModuleOptions {
  dependencies?: any[];
  providers?: any[];
}
