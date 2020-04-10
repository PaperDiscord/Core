import { Type } from '../interfaces/type.interface';
import { PaperContainer } from '../paper/container';
import { TestingApp } from './testing-app';

class TestingFactoryStatics {
  public static async create(module: Type<any>) {
    const container = await PaperContainer.create(module);

    return new TestingApp(container);
  }
}

export const TestingFactory = TestingFactoryStatics;
