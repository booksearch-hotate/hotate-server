import ResStatus from '../infrastructure/session/status/resStatus';
import {IPageStatus} from '../routers/datas/IPage';

export default function conversionpageStatus(status: ResStatus | undefined): IPageStatus | undefined {
  if (status !== undefined) {
    let resObj: IPageStatus = {} as IPageStatus;

    switch (status.type) {
      case 'Success':
        resObj = {
          mes: status.mes,
          buttonType: 'success',
        };
        break;
      case 'Failure':
        resObj = {
          mes: status.mes,
          buttonType: 'danger',
        };
        break;
    }
    return resObj;
  } else {
    return undefined;
  }
}
