import { TestingFactory, TestingApp } from '../../src/testing';
import { Module } from '../../src/module/module.decorator';
import { Logger, LoggerLevel, Controller, Command } from '../../src';
describe('Test', () => {
  let testingApp: TestingApp;

  @Module({})
  class BaseModule {}

  beforeAll(() => (Logger.level = LoggerLevel.ERROR));

  beforeEach(
    async () => (testingApp = await TestingFactory.create(BaseModule)),
  );

  it('should successfully initialize the controllers', async () => {
    @Controller()
    class BasicController {}

    await testingApp.container.addController(BasicController);
    expect(testingApp.container.controllers.get(BasicController)).toBeTruthy();
    expect(testingApp.container.providers.get(BasicController)).toBeTruthy();
  });

  it('should map the controller commands', async () => {
    @Controller()
    class BasicController {
      @Command('hello')
      public async run() {}
    }

    await testingApp.container.addController(BasicController);
    expect(testingApp.container.commandHandlers.get('hello')).toBeTruthy();
  });
});
