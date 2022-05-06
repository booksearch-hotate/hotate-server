import AdminData from "../dto/AdminData"

export default interface IAdminSession {
  create (adminData: AdminData): string
  verify (token: string): boolean
  get Token (): string
  get LoginStatus (): string
  set LoginStatus (status: string)
}
