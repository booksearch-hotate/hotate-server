import AdminData from '../../domain/model/admin/adminData';

export interface IAdminSession {
  create (adminData: AdminData): string
  verifyToken (token: string): boolean
}
