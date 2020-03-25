import { Provider } from '../../core/providers/provider';
import { Service } from '../../core/services/service';
import chalk from 'chalk';
import moment from 'moment';
import { Logger } from './logger';

export enum LoggerLevel {
  DEBUG = 0,
  SILLY = 1,
  VERBOSE = 2,
  INFO = 3,
  WARN = 4,
  ERROR = 5,
}

@Service()
export class LoggerService {
  public level: LoggerLevel =
    Number(process.env.PAPER_LOGGER_LEVEL) || LoggerLevel.DEBUG;

  constructor(private readonly defaultNamespace = 'App') {}

  private async log(
    message: string,
    namespace = this.defaultNamespace,
    level = 'INFO',
  ) {
    console.log(
      `${chalk.yellowBright(
        `[${chalk.green(`PaperDiscord`)} | ${chalk.green(level)}]`,
      )} ${chalk.gray(
        moment().format('YY/MM/DD HH:mm:ss'),
      )} - ${chalk.yellowBright(
        `[${chalk.green(namespace)}] ${chalk.yellow(message)}`,
      )}`,
    );
  }

  public info(message: string, namespace = this.defaultNamespace) {
    if (this.level <= LoggerLevel.INFO) this.log(message, namespace, 'INFO');
  }

  public verbose(message: string, namesapce = this.defaultNamespace) {
    if (this.level <= LoggerLevel.INFO) this.log(message, namesapce, 'VERB');
  }

  public child(namespace: string) {
    return new Logger(`${this.defaultNamespace}:${namespace}`);
  }
}
