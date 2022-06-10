type ResStatus = Success | Failure;

type Success = {type: 'Success', from: string};
type Failure = {type: 'Failure'; error: Error, from: string};

export default ResStatus;
