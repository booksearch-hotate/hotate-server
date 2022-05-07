import * as jwt from 'jsonwebtoken'

import IAdminSession from "../../application/session/IAdminSession"
import AdminData from "../../application/dto/AdminData"

export default class AdminSession implements IAdminSession {
  private token: string
  private readonly jwtSecret = 'secret'
  private loginStatus = 'logout'
  private id: string
  private pw: string

  constructor () {
    this.id = this.pw = this.token = ''
  }

  public create (adminData: AdminData): string {
    const jwtPayload = {
      id: adminData.Id,
      pw: adminData.Pw
    }
    this.token = jwt.sign(jwtPayload, this.jwtSecret)
    this.id = adminData.Id
    this.pw = adminData.Pw
    return this.token
  }

  public verify (token: string | undefined): boolean {
    try {
      if (token === undefined) return false
      const decoded = jwt.verify(token, this.jwtSecret) as { id: string, pw: string }
      if (decoded.id === this.id && decoded.pw === this.pw) {
        return true
      }
    } catch (e) {
      return false
    }
    return false
  }

  public get Token (): string {
    return this.token
  }

  public get LoginStatus (): string {
    return this.loginStatus
  }

  public set LoginStatus (status: string) {
    this.loginStatus = status
  }
}
