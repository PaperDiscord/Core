import { PaperModule, PaperModuleOptions } from '../../core/module';
import { PaperFactory } from '../../core/paper-factory';

describe('Paper Factory', () => {
  it('should create a module', async () => {
    const moduleOptions: PaperModuleOptions = {
      dependencies: [],
      providers: [],
    };
    @PaperModule(moduleOptions)
    class Example {}

    const app = await PaperFactory.create(Example);
    expect(app).toBeTruthy();
  });

  it('should not create a module due to invalid paper module (invalid class)', async () => {
    class Example {}
    try {
      const app = await PaperFactory.create(Example);
      expect(app).not.toBeTruthy();
    } catch (e) {
      expect(e).toBeTruthy();
    }
  });
});
