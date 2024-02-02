import Admin from './admin';

export interface IAdminApplicationRepository {
  getAdmin (): Promise<Admin>
  insertAdmin(admin: Admin): Promise<void>
  updateAdmin(admin: Admin): Promise<void>
  findById(id: string): Promise<Admin | null>
}
