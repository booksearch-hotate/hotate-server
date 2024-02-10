import Logger from "../../infrastructure/logger/logger";

export default abstract class TreeResponse<O> {
  public errObj: { message: string } | null = null;

  private readonly logger = new Logger(TreeResponse.name);

  public abstract success(o: O): TreeResponse<O>;

  public error(e: Error) {
    this.errObj = {message: e.message};
    this.logger.error(e.stack || e.message);
    return this;
  }
}
