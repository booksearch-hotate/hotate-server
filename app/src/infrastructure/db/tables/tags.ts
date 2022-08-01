import {Sequelize, Model, DataTypes} from 'sequelize';
import UsingTagTable from './usingTags';

export default class TagTable extends Model {
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
    this.hasMany(UsingTagTable, {
      sourceKey: 'id',
      foreignKey: 'tag_id',
    });
  }
}
