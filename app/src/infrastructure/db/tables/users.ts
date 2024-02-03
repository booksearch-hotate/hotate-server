import {DataTypes, Model} from 'sequelize';

export default class UserTable extends Model {
  public id!: number;
  public email!: string;
  public password!: string;
  public token!: string;
  public created_at!: Date;
  public updated_at!: Date;
  public role!: 'user' | 'admin';

  public static initialize(sequelize: any) {
    this.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      token: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'user',
      },
    }, {
      sequelize,
      tableName: 'users',
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    });
    return this;
  }
}
