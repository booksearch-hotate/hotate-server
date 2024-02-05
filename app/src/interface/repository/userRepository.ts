import dotenv from 'dotenv';

import {IUserRepository} from '../../domain/model/user/IUserRepository';
import {MySQLDBError} from '../../presentation/error/infrastructure/mySQLDBError';
import User from '../../domain/model/user/user';
import {PrismaClient} from '@prisma/client';

export default class UserRepository implements IUserRepository {
  private readonly db: PrismaClient;

  public constructor(db: PrismaClient) {
    this.db = db;
    dotenv.config();
  }

  public async createUser(user: User): Promise<void> {
    try {
      await this.db.users.create({data: {email: user.Email, password: user.Password, token: user.Token, role: user.Role}});
    } catch (e: any) {
      throw new MySQLDBError(e.message);
    }
  }

  public async findById(id: number): Promise<User | null> {
    const res = await this.db.users.findFirst({where: {id}});

    return res ? new User(res.id, res.email, res.password, res.role, res.token) : null;
  }

  public async findByEmail(email: string): Promise<User | null> {
    const res = await this.db.users.findFirst({where: {email}});

    return res ? new User(res.id, res.email, res.password, res.role, res.token) : null;
  }

  public async findByToken(token: string): Promise<User | null> {
    const res = await this.db.users.findFirst({where: {token}});

    return res ? new User(res.id, res.email, res.password, res.role, res.token) : null;
  }

  public async clearToken(email: string): Promise<void> {
    try {
      await this.db.users.updateMany({data: {token: null}, where: {email}});
    } catch (e) {
      throw new MySQLDBError('Failed to execute SQL to clear token.');
    }
  }

  public async isExistAdmin(): Promise<boolean> {
    const res = await this.db.users.findFirst({where: {role: 'admin'}});

    return res !== null;
  }

  public async update(user: User): Promise<void> {
    try {
      await this.db.users.update({data: {email: user.Email, password: user.Password, token: user.Token}, where: {id: user.Id}});
    } catch (e) {
      throw new MySQLDBError('Failed to execute SQL to update user.');
    }
  }
}
