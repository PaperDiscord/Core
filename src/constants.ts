export const MODULE_METADATA = '__module:global__';
export const PROVIDER_METADATA = '___provider:metadata__';
export const CONSTRUCTOR_PARAMTYPES = 'design:paramtypes';
export const PROPERTY_TYPE = `design:type`;
export const RETURN_TYPE = `design:returntype`;
export const PROPERTY_DATA = (name: string) => `__inject_property:${name}__`;
export const INJECT_FUNCTION_PARAM = (key: string, index: number) =>
  `__inject_function_param:${key}:${index}`;
export const COMMANDER_COMMAND_PROPERTIES = (key: string) =>
  `__commander_command:${key}__`;
export const COMMANDER_EVENT_PROPERTIES = (key: string) =>
  `__commander_event:${key}__`;
