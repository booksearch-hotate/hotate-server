import Logger from "../infrastructure/logger/logger";

const logger = new Logger("ControllerException");

export default class ControllerException extends Error {
  public constructor(message: string) {
    logger.error(message);
    super(message);
  }
}
