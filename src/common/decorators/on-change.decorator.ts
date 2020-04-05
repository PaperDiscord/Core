type Decorator = PropertyDecorator;

export type ObserveFunction = <T = any>(value: T, oldValue: T) => void;

/**
 *
 * @param onChangeCallback
 *
 * @publicApi
 */
export const OnChange = (onChangeCallback: ObserveFunction): Decorator => (
  target,
  property,
) => {
  Object.defineProperty(target, property, {
    get: () => target[`__internal__${property.toString()}`],
    set: (value) => {
      onChangeCallback(value, this[property]);
      target[`__internal__${property.toString()}`] = value;
    },
    enumerable: true,
    configurable: true,
  });
};
