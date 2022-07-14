import AdminData from '../../presentation/mapper/adminData';

export interface IAdminSession {
  create (adminData: AdminData): string
  verifyToken (token: string): boolean
}
