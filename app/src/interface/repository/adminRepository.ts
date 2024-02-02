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
      const admin = await this.db.Admin.sequelize?.query(

          `SELECT id, CONVERT(AES_DECRYPT(UNHEX(pw), '${process.env.DB_PW_KEY}') USING utf8) AS pw FROM admin LIMIT 1`,
      );

      if (!admin) throw new MySQLDBError('admin not found');

      /* sequelize.queryは[result, metadata]をレスポンスし
      resultはフィールド数分ある配列なので[0][0]と指定 */
      // https://sequelize.org/docs/v6/core-concepts/raw-queries/
      // eslint-disable-next-line no-magic-numbers
      const res = admin[0][0] as { id: string, pw: string };

      return new Admin(res.id, res.pw);
    } catch (e: any) {
      if (e instanceof MySQLDBError) throw e;

      throw new MySQLDBError('Failed to fetch to administrator.');
    }
  }

  public async insertAdmin(admin: Admin): Promise<void> {
    try {
      await this.db.Admin.sequelize?.query(
          `INSERT INTO admin VALUES ('${admin.Id}', HEX(AES_ENCRYPT('${admin.Pw}', '${process.env.DB_PW_KEY}')))`,
      );
    } catch (e) {
      throw new MySQLDBError('Failed to execute SQL to insert administrator.');
    }
  }

  public async updateAdmin(admin: Admin): Promise<void> {
    try {
      await this.db.Admin.sequelize?.query(
          `UPDATE admin SET id = '${admin.Id}', pw = HEX(AES_ENCRYPT('${admin.Pw}', '${process.env.DB_PW_KEY}'))`,
      );
    } catch (e) {
      throw new MySQLDBError('Failed to execute SQL to change administrator\'s information.');
    }
  }

  public async findById(id: string): Promise<Admin> {
    const res = await this.db.Admin.findOne({where: {id}});
    if (!res) throw new MySQLDBError('admin not found');

    return new Admin(res.id, res.pw);
  }
}
