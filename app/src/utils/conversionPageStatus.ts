import ResStatus from "../presentation/session/status/resStatus";

interface IPageStatus {
  mes: string,
  buttonType: "danger" | "success" | "warning" | "info"
}

export default function conversionpageStatus(status: ResStatus | undefined): IPageStatus | undefined {
  if (status !== undefined) {
    let resObj: IPageStatus = {} as IPageStatus;

    switch (status.type) {
      case "Success":
        resObj = {
          mes: status.mes,
          buttonType: "success",
        };
        break;
      case "Failure":
        resObj = {
          mes: status.mes,
          buttonType: "danger",
        };
        break;
      case "Warning":
        resObj = {
          mes: status.mes,
          buttonType: "warning",
        };
    }
    return resObj;
  } else {
    return undefined;
  }
}
