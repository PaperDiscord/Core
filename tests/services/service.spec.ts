import { TestingFactory, TestingApp } from '../../src/testing';
import { Module } from '../../src/module/module.decorator';
import { Logger, LoggerLevel, Controller, Command, Scope } from '../../src';
import { Service } from '../../src/service/service.decorator';
describe('Test', () => {
  let testingApp: TestingApp;

  @Module({})
  class BaseModule {}

  beforeAll(() => (Logger.level = LoggerLevel.ERROR));

  beforeEach(
    async () => (testingApp = await TestingFactory.create(BaseModule)),
  );

  it('should initialize the service successfully', async () => {
    @Service()
    class BasicService {}

    testingApp.container.addService(BasicService);

    expect(testingApp.container.providers.get(BasicService)).toBeTruthy();
  });

  it('should get different instances of a service for Scope.TRANSIENT', async () => {
    @Service({
      scope: Scope.TRANSIENT,
    })
    class BasicService {
      readonly random = Math.random();
    }

    testingApp.container.addService(BasicService);

    const [service1, service2] = await Promise.all([
      testingApp.app.getProviderInstance<BasicService>(BasicService),
      testingApp.app.getProviderInstance<BasicService>(BasicService),
    ]);

    expect(service1.random).not.toEqual(service2.random);
    // expect(service1).not.toEqual(service2);
  });
});
