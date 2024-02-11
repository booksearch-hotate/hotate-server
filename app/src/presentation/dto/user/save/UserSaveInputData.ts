export default class UserSaveInputData {
  public email: string;
  public password: string;
  public passwordConfirmation: string;
  public role: "user" | "admin";

  public constructor(email: string, password: string, passwordConfirmation: string, isAdmin: boolean) {
    this.email = email;
    this.password = password;
    this.passwordConfirmation = passwordConfirmation;
    this.role = isAdmin ? "admin" : "user";
  }
}
