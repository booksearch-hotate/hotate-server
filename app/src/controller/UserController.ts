import UserSaveInputData from "../presentation/dto/user/save/UserSaveInputData";
import UpdateUserInputData from "../presentation/dto/user/update/UpdateUserInputData";
import UserIsExistAdminResponse from "../presentation/response/user/UserIsExistAdminResponse";
import UserSaveResponse from "../presentation/response/user/UserSaveResponse";
import UserUpdateResponse from "../presentation/response/user/UserUpdateResponse";
import IsExistAdminUsecase from "../usecase/user/IsExistAdminUsecase";
import SaveUserUseCase from "../usecase/user/SaveUserUsecase";
import UpdateUserUseCase from "../usecase/user/UpdateUserUsecase";

export default class UserController {
  private saveUserUseCase: SaveUserUseCase;
  private updateUserUseCase: UpdateUserUseCase;
  private isExistAdminUseCase: IsExistAdminUsecase;

  public constructor(
      saveUserUseCase: SaveUserUseCase,
      updateUserUseCase: UpdateUserUseCase,
      isExistAdminUseCase: IsExistAdminUsecase,
  ) {
    this.saveUserUseCase = saveUserUseCase;
    this.updateUserUseCase = updateUserUseCase;
    this.isExistAdminUseCase = isExistAdminUseCase;
  }

  public async saveUser(
      email: string,
      password: string,
      passwordConfirmation: string,
      isAdmin: boolean,
  ): Promise<UserSaveResponse> {
    const res = new UserSaveResponse();
    try {
      const input = new UserSaveInputData(email, password, passwordConfirmation, isAdmin);
      await this.saveUserUseCase.execute(input);

      return res.success();
    } catch (e) {
      return res.error(e as Error);
    }
  }

  public async updateUser(
      id: number,
      email: string,
      password: string,
      passwordConfirmation: string,
      beforePassword: string,
  ): Promise<UserUpdateResponse> {
    const res = new UserUpdateResponse();
    try {
      const input = new UpdateUserInputData(
          id,
          email,
          password,
          passwordConfirmation,
          beforePassword,
      );

      await this.updateUserUseCase.execute(input);

      return res.success();
    } catch (e) {
      return res.error(e as Error);
    }
  }

  public async isExistAdmin(): Promise<UserIsExistAdminResponse> {
    const res = new UserIsExistAdminResponse();

    try {
      const isExist = await this.isExistAdminUseCase.execute();

      return res.success(isExist);
    } catch (e) {
      return res.error();
    }
  }
}
