import * as jwt from 'jsonwebtoken'

export default class AuthModule {
  private id: string // ユーザーID
  private password: string // パスワード
  private token: string // トークン
  private isLogin: boolean // ログイン状態
  private readonly jwtSecret = 'secret' // JWTシークレット

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
      return true
    }
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
  public verifyToken (token: string): boolean {
    try {
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

  public isAlreadyLogin (token: string) {
    return this.isLogin && this.verifyToken(token)
  }
}
