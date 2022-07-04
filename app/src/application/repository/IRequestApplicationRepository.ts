import RequestModel from '../../domain/model/requestModel';

export interface IRequestApplicationRepository {
  register(request: RequestModel): Promise<void>
}
