import User from "../../domain/model/user/user";
import {IUserDBRepository} from "../../domain/repository/db/IUserDBRepository";
import UserService from "../../domain/service/userService";
import UserSaveInputData from "../../presentation/dto/user/save/UserSaveInputData";
import {Usecase} from "../Usecase";

export default class SaveUserUseCase implements Usecase<UserSaveInputData, Promise<void>> {
  private userDB: IUserDBRepository;
  private userService: UserService;

  public constructor(userDB: IUserDBRepository, userService: UserService) {
    this.userDB = userDB;
    this.userService = userService;
  }

  public async execute(input: UserSaveInputData): Promise<void> {
    const user = new User(null, input.email, input.password, input.role);

    if (!this.userService.comparePassword(user, input.passwordConfirmation)) throw new Error("パスワードが一致しません。");

    if (await this.userService.isExistByEmail(user)) throw new Error("既に登録されているメールアドレスです。");

    await this.userDB.save(user);
  }
}
