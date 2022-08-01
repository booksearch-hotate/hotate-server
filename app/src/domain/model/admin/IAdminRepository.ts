import Admin from './adminModel';

export interface IAdminApplicationRepository {
  getAdmin (): Promise<Admin>
  insertAdmin(admin: Admin): Promise<void>
  updateAdmin(admin: Admin): Promise<void>
}
