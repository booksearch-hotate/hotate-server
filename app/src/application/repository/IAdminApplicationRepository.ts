import AdminModel from '../../domain/model/adminModel';

export interface IAdminApplicationRepository {
  getAdmin (): Promise<AdminModel>
  insertAdmin(id: string, pw: string): Promise<void>
}
