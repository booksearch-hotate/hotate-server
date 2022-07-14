import AdminModel from './adminModel';

export interface IAdminApplicationRepository {
  getAdmin (): Promise<AdminModel>
  insertAdmin(admin: AdminModel): Promise<void>
  updateAdmin(admin: AdminModel): Promise<void>
}
