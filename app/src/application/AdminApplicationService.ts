import AdminModel from "../domain/model/adminModel"
import IAdminApplicationRepository from "./repository/IAdminApplicationRepository"
import AdminData from "./dto/AdminData"
import AdminService from "../domain/service/adminService"

export default class AdminApplicationService {
  private readonly adminRepository: IAdminApplicationRepository
  private readonly adminService: AdminService

  public constructor (adminRepository: IAdminApplicationRepository) {
    this.adminRepository = adminRepository
    this.adminService = new AdminService()
  }

  public isValid (adminData: AdminData): boolean {
    const target = new AdminModel(adminData.Id, adminData.Pw)
    const admin = this.adminRepository.getAdmin()
    return this.adminService.isValid(target, admin)
  }
}
