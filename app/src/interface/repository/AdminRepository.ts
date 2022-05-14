import Admin from "../../infrastructure/db/tables/admin"
import dotenv from 'dotenv'
import Logger from "../../infrastructure/logger/logger"

import IAdminApplicationRepository from "../../application/repository/IAdminApplicationRepository"
import AdminModel from "../../domain/model/adminModel"

/* Sequelizeを想定 */
interface sequelize {
  Admin: typeof Admin,
}

export default class AdminRepository implements IAdminApplicationRepository {
  private readonly db: sequelize
  private readonly logger: Logger

  public constructor (db: sequelize) {
    this.db = db
    dotenv.config()
    this.logger = new Logger("AdminRepository")
  }

  public async getAdmin (): Promise<AdminModel> {
    try {
      const admin = await this.db.Admin.sequelize?.query(`SELECT id, CONVERT(AES_DECRYPT(UNHEX(pw), '${process.env.DB_PW_KEY}') USING utf8) AS pw FROM admin LIMIT 1`)
      if (!admin) throw new Error("admin not found")
      /* sequelize.queryは[result, metadata]をレスポンスし、resultはフィールド数分ある配列なので[0][0]と指定 */
      // https://sequelize.org/docs/v6/core-concepts/raw-queries/
      // eslint-disable-next-line no-magic-numbers
      const res = admin[0][0] as { id: string, pw: string }
      return new AdminModel(res.id, res.pw)
    } catch (e) {
      throw new Error("Could not obtain the administrator's id or pw.\n Error: " + e as string)
    }
  }
}
