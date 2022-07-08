import RequestModel from '../../domain/model/requestModel';

export interface IRequestApplicationRepository {
  register(request: RequestModel): Promise<void>
  delete(id: string): Promise<void>
  findAll(): Promise<RequestModel[] | null>
}
