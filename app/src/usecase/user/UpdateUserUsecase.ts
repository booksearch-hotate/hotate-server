import {IUserDBRepository} from "../../domain/repository/db/IUserDBRepository";
import UserService from "../../domain/service/userService";
import UpdateUserInputData from "../../presentation/dto/user/update/UpdateUserInputData";
import {Usecase} from "../Usecase";

export default class UpdateUserUseCase implements Usecase<UpdateUserInputData, Promise<void>> {
  private readonly userDBRepository: IUserDBRepository;
  private readonly userService: UserService;

  public constructor(userDBRepository: IUserDBRepository, userService: UserService) {
    this.userDBRepository = userDBRepository;
    this.userService = userService;
  }

  public async execute(input: UpdateUserInputData): Promise<void> {
    const user = await this.userDBRepository.findById(input.userId);

    if (user === null) throw new Error("ユーザが見つかりません。");

    user.Email = input.email;

    if (await this.userService.isExistByEmail(user)) throw new Error("そのメールアドレスは既に登録されています。");

    if (!this.userService.comparePassword(user, input.beforePassword)) throw new Error("現在のパスワードが異なります。");

    user.Password = input.password;

    if (!this.userService.comparePassword(user, input.passwordConfirmation)) throw new Error("パスワードが異なります。");

    await this.userDBRepository.update(user);
  }
}
