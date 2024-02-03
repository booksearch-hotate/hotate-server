import crypt from '../../../infrastructure/auth/crypt';

export default class UserSerive {
  public comparePassword(password: string, hash: string): boolean {
    return crypt.compare(password, hash);
  }
}
