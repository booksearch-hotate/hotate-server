import AdminModel from "../../domain/model/adminModel"

export default interface IAdminApplicationRepository {
  getAdmin (): Promise<AdminModel>
}
