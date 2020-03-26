/**
 * The Reflection Metadata Key for the Module Metadata
 */
export const MODULE_METADATA = '__module:global__';
/**
 * The Reflection Metadata Key for the Privder Metadata
 */
export const PROVIDER_METADATA = '___provider:metadata__';
export const CONSTRUCTOR_PARAMTYPES = 'design:paramtypes';
export const PROPERTY_TYPE = `design:type`;
export const RETURN_TYPE = `design:returntype`;

/**
 * This is used for the Property Injection
 */
export const PROPERTY_DATA = (name: string) => `__inject_property:${name}__`;
/**
 * The data for the Function Params, and their index
 */
export const INJECT_FUNCTION_PARAM = (key: string, index: number) =>
  `__inject_function_param:${key}:${index}`;

/**
 * The Command Properties for a particual command
 */
export const COMMANDER_COMMAND_PROPERTIES = (key: string) =>
  `__commander_command:${key}__`;

/**
 * The Event Properties
 */
export const COMMANDER_EVENT_PROPERTIES = (key: string) =>
  `__commander_event:${key}__`;
