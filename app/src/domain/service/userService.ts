import crypt from "../../infrastructure/auth/crypt";
import User from "../model/user/user";
import {IUserDBRepository} from "../repository/db/IUserDBRepository";

export default class UserService {
  private readonly userDBRepository: IUserDBRepository;

  public constructor(userDBRepository: IUserDBRepository) {
    this.userDBRepository = userDBRepository;
  }

  public comparePassword(user: User, rowPassword: string): boolean {
    return crypt.compare(rowPassword, user.Password);
  }

  public async isExistByEmail(user: User): Promise<boolean> {
    const found = await this.userDBRepository.findByEmail(user.Email);

    return found !== null && found.Id !== user.Id;
  }
}
