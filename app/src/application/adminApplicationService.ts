import Admin from '../domain/model/admin/admin';
import {IAdminApplicationRepository} from '../domain/model/admin/IAdminRepository';
import AdminData from '../domain/model/admin/adminData';
import AdminService from '../domain/service/adminService';
import {DomainInvalidError, FormInvalidError, InfrastructureError} from '../presentation/error';
import {MySQLDBError} from '../presentation/error/infrastructure/mySQLDBError';

export default class AdminApplicationService {
  private readonly adminRepository: IAdminApplicationRepository;
  private readonly adminService: AdminService;

  public constructor(adminRepository: IAdminApplicationRepository, adminService: AdminService) {
    this.adminRepository = adminRepository;
    this.adminService = adminService;
  }

  public async isValid(adminData: AdminData): Promise<boolean> {
    const target = new Admin(adminData.Id, adminData.Pw);
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
    const admin = new Admin(id, pw);

    await this.adminRepository.insertAdmin(admin);
  }

  public async updateAdmin(id: string, pw: string): Promise<void> {
    try {
      const admin = new Admin(id, pw);

      await this.adminRepository.updateAdmin(admin);
    } catch (e: any) {
      if (e instanceof DomainInvalidError) throw new FormInvalidError('A value was entered that violates the rule');
      else if (e instanceof MySQLDBError) throw new InfrastructureError(e.message);
      else throw e;
    }
  }
}
