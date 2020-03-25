import { Provider } from '../providers/provider';
import { ProviderDecorator } from '../providers/provider.decorator';

export interface CommanderOptions {
  baseCommand: string;
}

export interface ICommander {
  type: 'Commander';
  options: CommanderOptions;
}

export const Commander = (options: string | CommanderOptions) =>
  ProviderDecorator({
    type: 'Commander',
    options: typeof options === 'string' ? { baseCommand: options } : options,
  });
