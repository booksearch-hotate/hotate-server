import * as jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import {Request} from 'express';

import AdminData from '../../domain/model/admin/adminData';

dotenv.config();

export default class AdminSession {
  private readonly jwtSecret = process.env.JWTSECRET as string;
  private id: string;
  private pw: string;

  constructor() {
    this.id = this.pw = '';
  }

  /**
   * 管理者データからトークンを作成します。
   * @param adminData 管理者データ
   */
  public create(adminData: AdminData): string {
    const jwtPayload = {
      id: adminData.Id,
      pw: adminData.Pw,
    };
    return jwt.sign(jwtPayload, this.jwtSecret);
  }

  /**
   * 認証トークンを用いて認証の可否を取得します。
   * @param token 認証トークン
   * @returns 認証に成功したか否か
   */
  public verifyToken(token: string | undefined): boolean {
    try {
      if (token === undefined) return false;
      const decoded = jwt.verify(token, this.jwtSecret) as { id: string, pw: string };
      this.id = decoded.id;
      this.pw = decoded.pw;
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * トークンをリセットします。
   * @param req リクエスト
   */
  public delete(req: Request): void {
    req.session.token = '';
  }

  public get Id(): string {
    return this.id;
  }

  public get Pw(): string {
    return this.pw;
  }
}
