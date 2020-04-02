import {
  ModuleOptions,
  ModuleMetadata,
} from '../interfaces/module/module.interface';
import { PAPER_MODULE_OPTIONS } from '../contants';

export const Module = (options: ModuleOptions): ClassDecorator => target => {
  Reflect.defineMetadata(
    PAPER_MODULE_OPTIONS,
    {
      module: target,
      data: {
        controllers: [],
        exports: [],
        imports: [],
        providers: [],
        ...options,
      },
    },
    target,
  );
};
