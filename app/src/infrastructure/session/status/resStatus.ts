type ResStatus = Success | Failure;

type Success = {type: 'Success', mes: string};
type Failure = {type: 'Failure'; error: Error, mes: string};

export default ResStatus;
