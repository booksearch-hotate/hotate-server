import {Sequelize, Model, DataTypes} from 'sequelize';
import {HasManyCreateAssociationMixin} from 'sequelize';

import RequestTable from './requests';

export default class DepartmentTable extends Model {
  public id!: string;
  public name!: string;

  public createBook!: HasManyCreateAssociationMixin<RequestTable>;

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
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    });
    return this;
  }

  public static associate() {
    this.hasMany(RequestTable, {
      sourceKey: 'id',
      foreignKey: 'department_id',
    });
  }
}
