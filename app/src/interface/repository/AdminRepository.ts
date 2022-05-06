import dotenv from 'dotenv'

import IAdminApplicationRepository from "../../application/repository/IAdminApplicationRepository"
import AdminModel from "../../domain/model/adminModel"

export default class AdminRepository implements IAdminApplicationRepository {
  constructor () {
    dotenv.config()
  }

  public getAdmin (): AdminModel {
    const id = process.env.ADMIN_ID
    const pw = process.env.ADMIN_PW
    return new AdminModel(id, pw)
  }
}
