import AdminModel from '../domain/model/admin/adminModel';
import {IAdminApplicationRepository} from '../domain/model/admin/IAdminRepository';
import AdminData from '../presentation/mapper/adminData';
import AdminService from '../domain/service/adminService';

export default class AdminApplicationService {
  private readonly adminRepository: IAdminApplicationRepository;
  private readonly adminService: AdminService;

  public constructor(adminRepository: IAdminApplicationRepository, adminService: AdminService) {
    this.adminRepository = adminRepository;
    this.adminService = adminService;
  }

  public async isValid(adminData: AdminData): Promise<boolean> {
    const target = new AdminModel(adminData.Id, adminData.Pw);
    const admin = await this.adminRepository.getAdmin();
    return this.adminService.isValid(target, admin);
  }

  /**
   * 管理者のIDとpwが設定されているか
   */
  public async isExist(): Promise<boolean> {
    try {
      await this.adminRepository.getAdmin();
      return true;
    } catch (e) {
      return false;
    }
  }

  public async insertAdmin(id: string, pw: string): Promise<void> {
    const admin = new AdminModel(id, pw);

    await this.adminRepository.insertAdmin(admin);
  }

  public async updateAdmin(id: string, pw: string): Promise<void> {
    const admin = new AdminModel(id, pw);

    await this.adminRepository.updateAdmin(admin);
  }
}
