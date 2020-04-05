import { SET_METADATA_PREFIX } from '../../contants';

type Decorator = ClassDecorator & MethodDecorator & PropertyDecorator;

const setClassMetadata = (target: Function, key: string, value: any) => {
  Reflect.defineMetadata(key, value, target);

  for (const propertyName of Object.getOwnPropertyNames(target.prototype)) {
    Reflect.defineMetadata(key, value, target.prototype[propertyName]);
  }
};

const setPropertyMetadata = (
  target: Object,
  propertyKey: string | symbol,
  key: string,
  value: any,
) => {
  Reflect.defineMetadata(key, value, target[propertyKey]);
};

const setMethodMetadata = (
  target: Object,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<any>,
  key: string,
  value: any,
) => {
  Reflect.defineMetadata(key, value, target[propertyKey]);
};

export const SetMetadata = (key: string, metadata: any): Decorator => (
  ...args: any[]
) => {
  key = SET_METADATA_PREFIX + key;

  if (args.length === 1) setClassMetadata(args[0], key, metadata);
  if (args.length === 2) setPropertyMetadata(args[0], args[1], key, metadata);
  if (args.length === 3)
    setMethodMetadata(args[0], args[1], args[2], key, metadata);
};
