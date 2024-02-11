import {PrismaClient} from "@prisma/client";
import {IUserDBRepository} from "../../../domain/repository/db/IUserDBRepository";
import User from "../../../domain/model/user/user";

export default class UserPrismaRepository implements IUserDBRepository {
  private readonly db: PrismaClient;

  public constructor(db: PrismaClient) {
    this.db = db;
  }

  public async findByEmail(email: string): Promise<User | null> {
    const user = await this.db.users.findUnique({
      where: {
        email: email,
      },
    });

    if (user === null) return null;

    return new User(user.id, user.email, user.password, user.role, user.token);
  }

  public async findById(id: number): Promise<User | null> {
    const user = await this.db.users.findUnique({
      where: {
        id: id,
      },
    });

    if (user === null) return null;

    return new User(user.id, user.email, user.password, user.role, user.token);
  }

  public async save(user: User): Promise<void> {
    await this.db.users.create({
      data: {
        email: user.Email,
        password: user.Password,
        role: user.Role,
      },
    });
  }

  public async update(user: User): Promise<void> {
    await this.db.users.update({
      where: {
        id: user.Id,
      },
      data: {
        email: user.Email,
        password: user.Password,
      },
    });
  }

  public async delete(user: User): Promise<void> {
    await this.db.users.delete({
      where: {
        id: user.Id,
      },
    });
  }

  public async findAdmin(): Promise<User | null> {
    const user = await this.db.users.findFirst({
      where: {
        role: "admin",
      },
    });

    if (user === null) return null;

    return new User(user.id, user.email, user.password, user.role, user.token);
  }
}
