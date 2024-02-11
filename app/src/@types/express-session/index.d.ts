type ResStatus = Success | Failure | Warning;

type Success = {type: "Success", mes: string};
type Warning = {type: "Warning", mes: string};
type Failure = {type: "Failure"; error: Error, mes: string};

declare global {
  module "express-session" {
    // eslint-disable-next-line no-unused-vars
    interface SessionData {
      token: string,
      status: ResStatus,
      keepValue: any,
    }
  }
}

