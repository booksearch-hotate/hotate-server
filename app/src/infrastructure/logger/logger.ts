import log4js from 'log4js';
import {isLocal, isLogOutput} from '../cli/cmdLine';

export default class Logger {
  private logger: log4js.Logger; // コンソールへの出力

  constructor(name: string) {
    const defaultCategories = isLogOutput() ? {appenders: ['system', 'wrapErr'], level: isLocal() ? 'all' : 'info'} : {appenders: ['system'], level: 'debug'};
    log4js.configure({
      appenders: {
        system: {type: 'stdout'}, // 標準出力
        out: {type: 'file', filename: `log/system-${new Date().getFullYear()}-${new Date().getMonth() + 1}.log`}, // ログファイルへの出力
        wrapErr: {type: 'logLevelFilter', appender: 'out', level: 'info'},
      },
      categories: {
        default: defaultCategories,
      },
    });
    this.logger = log4js.getLogger(name);
  }

  public info(message: string) {
    this.logger.info(message);
  }

  public debug(message: string) {
    this.logger.debug(message);
  }

  public error(message: string) {
    this.logger.error(message);
  }

  public warn(message: string) {
    this.logger.warn(message);
  }

  public fatal(message: string) {
    this.logger.fatal(message);
  }
}
