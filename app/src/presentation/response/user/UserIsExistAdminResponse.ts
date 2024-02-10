import TreeResponse from "../TreeResponse";

export type UserIsExistAdminControllerOutput = {
  isExist: boolean;
};

export default class UserIsExistAdminResponse extends TreeResponse<UserIsExistAdminControllerOutput> {
  public isExist: boolean | null = null;

  public success(o: UserIsExistAdminControllerOutput) {
    this.isExist = o.isExist;

    return this;
  }

  public error() {
    return this;
  }
}
