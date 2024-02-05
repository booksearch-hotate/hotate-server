import User from '../model/user/user';

export interface IUserRepository {
  findByToken(token: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: number): Promise<User | null>;
  clearToken(email: string): Promise<void>;
  createUser(user: User): Promise<void>;
  update(user: User): Promise<void>;
  isExistAdmin(): Promise<boolean>;
}
