import chalk from 'chalk';
import moment from 'moment';

export enum LoggerLevel {
  DEBUG = 0,
  SILLY = 1,
  VERBOSE = 2,
  INFO = 3,
  WARN = 4,
  ERROR = 5,
}
/**
 * @publicApi
 */
export class Logger {
  public static level =
    Number(process.env.PAPER_LOGGER_LEVEL) || LoggerLevel.DEBUG;
  public level = Logger.level;

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

  public verbose(message: string, namespace = this.defaultNamespace) {
    if (this.level <= LoggerLevel.INFO)
      this.log(message, namespace, chalk.bgMagenta('VERB'));
  }

  public error(message: string, namespace = this.defaultNamespace) {
    if (this.level <= LoggerLevel.ERROR)
      this.log(message, namespace, chalk.red('ERR'));
  }

  public child(namespace: string) {
    return new Logger(`${this.defaultNamespace}:${namespace}`);
  }
}
