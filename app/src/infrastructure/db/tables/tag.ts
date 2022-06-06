import {Sequelize, Model, DataTypes} from 'sequelize';
import UsingTag from './usingTag';

export default class Tag extends Model {
  public id!: string;
  public name!: string;
  public created_at!: Date;
  public updated_at!: Date;

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

  public static associate() {
    this.hasMany(UsingTag, {
      sourceKey: 'id',
      foreignKey: 'tag_id',
    });
  }
}
