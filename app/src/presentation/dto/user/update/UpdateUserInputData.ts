export default class UpdateUserInputData {
  public userId: number;
  public email: string;
  public password: string;
  public passwordConfirmation: string;
  public beforePassword: string;

  public constructor(userId: number, email: string, password: string, passwordConfirmation: string, beforePassword: string) {
    this.userId = userId;
    this.email = email;
    this.password = password;
    this.passwordConfirmation = passwordConfirmation;
    this.beforePassword = beforePassword;
  }
}
