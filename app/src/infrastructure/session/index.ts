import * as jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import {Request} from 'express';

import {IAdminSession} from '../../application/session/IAdminSession';
import AdminData from '../../application/dto/AdminData';

dotenv.config();

export default class AdminSession implements IAdminSession {
  private token: string;
  private readonly jwtSecret = process.env.JWTSECRET as string;
  private id: string;
  private pw: string;

  constructor() {
    this.id = this.pw = this.token = '';
  }

  public create(adminData: AdminData): string {
    const jwtPayload = {
      id: adminData.Id,
      pw: adminData.Pw,
    };
    this.token = jwt.sign(jwtPayload, this.jwtSecret);
    this.id = adminData.Id;
    this.pw = adminData.Pw;
    return this.token;
  }

  public verify(token: string | undefined): boolean {
    try {
      if (token === undefined) return false;
      const decoded = jwt.verify(token, this.jwtSecret) as { id: string, pw: string };
      if (decoded.id === this.id && decoded.pw === this.pw) {
        return true;
      }
    } catch (e) {
      return false;
    }
    return false;
  }

  public delete(req: Request): void {
    req.session.destroy((err) => {
      if (err) throw err;
    });
    this.token = '';
  }

  public get Token(): string {
    return this.token;
  }
}
