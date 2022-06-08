import AdminData from '../dto/AdminData';

export interface IAdminSession {
  create (adminData: AdminData): string
  verifyToken (token: string): boolean
}
