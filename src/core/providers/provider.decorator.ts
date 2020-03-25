import { PROVIDER_METADATA, PROPERTY_TYPE } from '../../constants';

export interface ProviderMetadataOptions {}

export const ProviderDecorator = (
  metadata: ProviderMetadataOptions = {},
): ClassDecorator => target => {
  Reflect.defineMetadata(PROVIDER_METADATA, metadata, target);
};
