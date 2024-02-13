import {IUserDBRepository} from "../../domain/repository/db/IUserDBRepository";
import UserIsExistAdminOutputData from "../../presentation/dto/user/findAdmin/UserIsExistAdminOutputData";
import {Usecase} from "../Usecase";

export default class IsExistAdminUsecase implements Usecase<void, Promise<UserIsExistAdminOutputData>> {
  private readonly userDB: IUserDBRepository;

  public constructor(userDB: IUserDBRepository) {
    this.userDB = userDB;
  }

  public async execute(): Promise<UserIsExistAdminOutputData> {
    return new UserIsExistAdminOutputData(await this.userDB.findAdmin());
  }
}
