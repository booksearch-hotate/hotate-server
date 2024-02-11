import User from "../../model/user/user";

export interface IUserDBRepository {
  save(user: User): Promise<void>;
  findByEmail(email: string): Promise<User | null>;
  update(user: User): Promise<void>;
  findById(id: number): Promise<User | null>;
  delete(user: User): Promise<void>;
  findAdmin(): Promise<User | null>;
}
