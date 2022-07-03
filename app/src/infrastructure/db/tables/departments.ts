import {Sequelize, Model, DataTypes} from 'sequelize';

export default class Department extends Model {
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
      tableName: 'departments',
      timestamps: false,
    });
    return this;
  }
}
