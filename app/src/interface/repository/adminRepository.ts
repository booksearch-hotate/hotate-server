import AdminTable from '../../infrastructure/db/tables/admin';
import dotenv from 'dotenv';

import {IAdminApplicationRepository}
  from '../../domain/model/admin/IAdminRepository';
import Admin from '../../domain/model/admin/admin';
import {MySQLDBError} from '../../presentation/error/infrastructure/mySQLDBError';

/* Sequelizeを想定 */
interface sequelize {
  Admin: typeof AdminTable,
}

export default class AdminRepository implements IAdminApplicationRepository {
  private readonly db: sequelize;

  public constructor(db: sequelize) {
    this.db = db;
    dotenv.config();
  }

  public async getAdmin(): Promise<Admin> {
    try {
      const admin = await this.db.Admin.findAll();

      if (!admin) throw new MySQLDBError('admin not found');
      if (admin.length > 1) throw new MySQLDBError('admin is duplicated');

      return new Admin(admin[0].id, admin[0].pw);
    } catch (e: any) {
      if (e instanceof MySQLDBError) throw e;

      throw new MySQLDBError('Failed to fetch to administrator.');
    }
  }

  public async insertAdmin(admin: Admin): Promise<void> {
    try {
      await this.db.Admin.create({id: admin.Id, pw: admin.Pw});
    } catch (e) {
      throw new MySQLDBError('Failed to execute SQL to insert administrator.');
    }
  }

  public async updateAdmin(admin: Admin): Promise<void> {
    try {
      await this.db.Admin.update({pw: admin.Pw}, {where: {id: admin.Id}});
    } catch (e) {
      throw new MySQLDBError('Failed to execute SQL to change administrator\'s information.');
    }
  }

  public async findById(id: string): Promise<Admin | null> {
    const res = await this.db.Admin.findOne({where: {id}});

    return res ? new Admin(res.id, res.pw) : null;
  }
}
