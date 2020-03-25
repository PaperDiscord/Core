import { PaperModule } from '../../../core/module';
import { PaperModuleOptions } from '../../../core/module/paper-module';
import { MODULE_METADATA } from '../../../constants';

describe('Paper Module', () => {
  it('should createa a module', () => {
    const moduleOptions: PaperModuleOptions = {
      providers: [],
      dependencies: [],
    };
    @PaperModule(moduleOptions)
    class Example {}

    const newModuleOptions: PaperModuleOptions = Reflect.getMetadata(
      MODULE_METADATA,
      Example,
    );

    expect(moduleOptions.dependencies).toEqual(newModuleOptions.dependencies);
    expect(moduleOptions.providers).toEqual(newModuleOptions.providers);
  });
});
