import * as jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config() // envファイルの読み込み

export default class AuthModule {
  private id: string // ユーザーID
  private password: string // パスワード
  private token: string // トークン
  private isLogin: boolean // ログイン状態
  private readonly jwtSecret = 'secret' // JWTシークレット
  public loginStatus = 'logout' // ログイン状態

  constructor () {
    this.id = process.env.ADMIN_ID as string
    this.password = process.env.ADMIN_PW as string
    this.token = ''
    this.isLogin = false
  }

  // ログイン
  public canLogin (id: string, pw: string): boolean {
    return id === this.id && pw === this.password && !this.isLogin && this.token === ''
  }

  public loginFlow (id: string, pw: string): boolean {
    if (this.canLogin(id, pw)) { // ログインできれば
      this.token = this.makeToken() // トークンの発行
      this.isLogin = true
      this.loginStatus = 'login'
      return true
    }
    this.loginStatus = 'miss'
    return false
  }

  private makeToken (): string {
    const jwtPayload = {
      id: this.id,
      pw: this.password
    }
    return jwt.sign(jwtPayload, this.jwtSecret)
  }

  public getToken () {
    return this.token
  }

  // トークンの有効性をチェック
  public verifyToken (token: string | undefined): boolean {
    try {
      if (token === undefined) return false
      const decoded = jwt.verify(token, this.jwtSecret) as { id: string, pw: string }
      if (decoded.id === this.id && decoded.pw === this.password) {
        return true
      }
    } catch (e) {
      return false
    }
    return false
  }

  public logout () {
    this.token = ''
    this.isLogin = false
  }

  public isAlreadyLogin (token: string | undefined) {
    return token !== undefined && this.isLogin && this.verifyToken(token)
  }
}
