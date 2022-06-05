import {Sequelize, Model, DataTypes} from 'sequelize';

export default class Tag extends Model {
  public id!: string;
  public name!: string;

  public static initialize(sequelize: Sequelize) {
    this.init({
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    }, {
      sequelize,
      tableName: 'tags',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    });
    return this;
  }
}
