import AdminData from '../dto/adminData';

export interface IAdminSession {
  create (adminData: AdminData): string
  verifyToken (token: string): boolean
}
