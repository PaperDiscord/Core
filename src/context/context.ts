import { v4 as uuid } from 'uuid';

export class Context {
  public readonly id = uuid();
}
