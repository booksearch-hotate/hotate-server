type ResStatus = Success | Failure | Warning;

type Success = {type: 'Success', mes: string};
type Warning = {type: 'Warning', mes: string};
type Failure = {type: 'Failure'; error: Error, mes: string};

export default ResStatus;
