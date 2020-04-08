import { PaperContainer } from '../paper/container';

export class TestingApp {
  constructor(public readonly container: PaperContainer) {}

  public get app() {
    return this.container.getApp();
  }
}
