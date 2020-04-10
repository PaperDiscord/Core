import { TestingFactory, TestingApp } from '../../src/testing';
import { Module } from '../../src/module/module.decorator';
import { Logger, LoggerLevel, Controller } from '../../src';
describe('Test', () => {
  let testingApp: TestingApp;

  @Module({})
  class BaseModule {}

  beforeAll(() => (Logger.level = LoggerLevel.ERROR));

  beforeEach(
    async () => (testingApp = await TestingFactory.create(BaseModule)),
  );

  it('should add add and initialize the module', async () => {
    @Module()
    class ModuleToAdd {}

    await testingApp.container.addModule(ModuleToAdd);
    expect(testingApp.container.modules.get(ModuleToAdd)).toBeTruthy();
  });

  it('should initialize the providers of the modules', async () => {
    @Controller()
    class BasicController {}

    @Module({
      controllers: [BasicController],
    })
    class ModuleToAdd {}

    await testingApp.container.addModule(ModuleToAdd);
    expect(testingApp.container.providers.get(BasicController)).toBeTruthy();
  });

  it('should initialize the controllers of the modules', async () => {
    @Controller()
    class BasicController {}

    @Module({
      controllers: [BasicController],
    })
    class ModuleToAdd {}

    await testingApp.container.addModule(ModuleToAdd);
    expect(testingApp.container.controllers.get(BasicController)).toBeTruthy();
  });
});
