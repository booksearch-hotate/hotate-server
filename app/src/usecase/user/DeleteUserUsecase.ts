import {IUserDBRepository} from "../../domain/repository/db/IUserDBRepository";
import UserDeleteInputData from "../../presentation/dto/user/delete/UserDeleteInputData";
import {Usecase} from "../Usecase";

export default class DeleteUserUseCase implements Usecase<UserDeleteInputData, Promise<void>> {
  private userRepository: IUserDBRepository;

  public constructor(userRepository: IUserDBRepository) {
    this.userRepository = userRepository;
  }

  public async execute(input: UserDeleteInputData): Promise<void> {
    const user = await this.userRepository.findById(input.userId);
    if (user === null) throw new Error("User not found");

    await this.userRepository.delete(user);
  }
}
