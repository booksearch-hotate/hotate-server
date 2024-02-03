import dotenv from 'dotenv';

import UserTable from '../../infrastructure/db/tables/users';
import {IUserRepository} from '../../domain/model/user/IUserRepository';
import {MySQLDBError} from '../../presentation/error/infrastructure/mySQLDBError';
import User from '../../domain/model/user/user';

/* Sequelizeを想定 */
interface sequelize {
  User: typeof UserTable,
}

export default class UserRepository implements IUserRepository {
  private readonly db: sequelize;

  public constructor(db: sequelize) {
    this.db = db;
    dotenv.config();
  }

  public async createUser(user: User): Promise<void> {
    try {
      await this.db.User.create({email: user.Email, password: user.Password, token: user.Token, role: user.Role});
    } catch (e: any) {
      throw new MySQLDBError(e.message);
    }
  }

  public async findById(id: number): Promise<User | null> {
    const res = await this.db.User.findOne({where: {id}});

    return res ? new User(res.id, res.email, res.password, res.role, res.token) : null;
  }

  public async findByEmail(email: string): Promise<User | null> {
    const res = await this.db.User.findOne({where: {email}});

    return res ? new User(res.id, res.email, res.password, res.role, res.token) : null;
  }

  public async findByToken(token: string): Promise<User | null> {
    const res = await this.db.User.findOne({where: {token}});

    return res ? new User(res.id, res.email, res.password, res.role, res.token) : null;
  }

  public async clearToken(email: string): Promise<void> {
    try {
      await this.db.User.update({token: null}, {where: {email}});
    } catch (e) {
      throw new MySQLDBError('Failed to execute SQL to clear token.');
    }
  }

  public async isExistAdmin(): Promise<boolean> {
    const res = await this.db.User.findOne({where: {role: 'admin'}});

    return res !== null;
  }

  public async update(user: User): Promise<void> {
    try {
      await this.db.User.update({email: user.Email, password: user.Password, token: user.Token}, {where: {id: user.Id}});
    } catch (e) {
      throw new MySQLDBError('Failed to execute SQL to update user.');
    }
  }
}
