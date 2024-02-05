import {IUserRepository} from '../domain/repository/IUserRepository';
import User from '../domain/model/user/user';
import UserSerive from '../domain/service/userService';

export default class UserApplicationService {
  private readonly userRepository: IUserRepository;
  private readonly userService: UserSerive;

  public constructor(userRepository: IUserRepository, userService: UserSerive) {
    this.userRepository = userRepository;
    this.userService = userService;
  }

  public async isExistAdmin(): Promise<boolean> {
    return await this.userRepository.isExistAdmin();
  }

  public async createUser(email: string, password: string, pwConfirmation: string, isAdmin: boolean): Promise<void> {
    if (password !== pwConfirmation) throw new Error('パスワードが一致しません。');

    const user = new User(null, email, password, isAdmin ? 'admin' : 'user', this.makeToken());

    await this.userRepository.createUser(user);

    // TODO: メール認証機能の実装
  }

  public async updateUser(id: number, email: string, password: string, pwConfirmation: string, beforePw: string): Promise<void> {
    if (password !== pwConfirmation) throw new Error('パスワードが一致しません。');

    const user = await this.userRepository.findById(id);

    if (!user) throw new Error('ユーザーが見つかりません。');

    if (!this.userService.comparePassword(beforePw, user.Password)) throw new Error('パスワードが違います。');

    user.Email = email;
    user.Password = password;
    user.Token = this.makeToken();

    await this.userRepository.update(user);

    // TODO: メール認証機能の実装（変更前のメールアドレスにもメールを送信）
  }

  private makeToken() {
    const S = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const N = 6;
    return Array.from(crypto.getRandomValues(new Uint32Array(N)))
        .map((n) => S[n % S.length])
        .join('');
  };
}
