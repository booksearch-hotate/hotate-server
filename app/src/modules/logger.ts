import log4js from "log4js"

export default class Logger {
  private logger: log4js.Logger

  constructor (name: string) {
    log4js.configure({
      appenders: {
        out: { type: "stdout" }, // 標準出力
        system: { type: "file", filename: `log/${name}.log` } // ログファイルへの出力
      },
      categories: {
        default: { appenders: ["out"], level: "debug" }
      }
    })
    this.logger = log4js.getLogger(name)
  }

  public info (message: string) {
    this.logger.info(message)
  }

  public debug (message: string) {
    this.logger.debug(message)
  }

  public error (message: string) {
    this.logger.error(message)
  }

  public warn (message: string) {
    this.logger.warn(message)
  }
}
