import crypt from '../../../infrastructure/auth/crypt';

export default class User {
  private id: number | null;
  private token: string | null;
  private email: string;
  private password: string;
  private role: 'user' | 'admin';

  MAX_PW_LEN = 60;

  public constructor(
      id: number | null,
      email: string,
      password: string,
      role: 'user' | 'admin' = 'user',
      token: string | null = null,
  ) {
    if (password.length === 0 || password.length > this.MAX_PW_LEN) throw new Error('パスワードの長さが異なっています。');
    if (!this.isValidEmail(email)) throw new Error('メールアドレスの形式が異なっています。');

    this.id = id;
    this.token = token;
    this.email = email;
    this.password = this.isBcryptHash(password) ? password : crypt.encrypt(password);
    this.role = role;
  }

  private isValidEmail(email: string): boolean {
    const regex = /^takako-.+@.+\..+$/;
    return regex.test(email);
  }

  get Id(): number | null {
    return this.id;
  }

  get Token(): string | null {
    return this.token;
  }

  set Token(token: string | null) {
    this.token = token;
  }

  get Email(): string {
    return this.email;
  }

  set Email(email: string) {
    if (!this.isValidEmail(email)) throw new Error('メールアドレスの形式が異なっています。');
    this.email = email;
  }

  get Password(): string {
    return this.password;
  }

  set Password(password: string) {
    if (password.length === 0 || password.length > this.MAX_PW_LEN) throw new Error('パスワードの長さが異なっています。');
    this.password = this.isBcryptHash(password) ? password : crypt.encrypt(password);
  }

  get Role(): 'user' | 'admin' {
    return this.role;
  }

  private isBcryptHash(str: string): boolean {
    return /^\$2[abyx]\$/.test(str);
  }
}
