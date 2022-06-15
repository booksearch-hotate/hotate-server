import log4js from 'log4js';
import {isLogOutput} from '../cli/cmdLine';

export default class Logger {
  private logger: log4js.Logger; // コンソールへの出力

  constructor(name: string) {
    const defaultCategories = isLogOutput() ? {appenders: ['out', 'system'], level: 'info'} : {appenders: ['system'], level: 'debug'};
    log4js.configure({
      appenders: {
        system: {type: 'stdout'}, // 標準出力
        out: {type: 'file', filename: `log/system.log`}, // ログファイルへの出力
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
