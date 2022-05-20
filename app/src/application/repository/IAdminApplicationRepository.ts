import AdminModel from '../../domain/model/adminModel';

export interface IAdminApplicationRepository {
  getAdmin (): Promise<AdminModel>
}
