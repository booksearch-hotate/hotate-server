import User from "../../../../domain/model/user/user";

export default class UserIsExistAdminOutputData {
  public isExist: boolean;

  public constructor(admin: User | null) {
    this.isExist = admin !== null;
  }
}
