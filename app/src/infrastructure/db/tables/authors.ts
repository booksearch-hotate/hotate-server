import {Sequelize, Model, DataTypes} from 'sequelize';
import {HasManyCreateAssociationMixin} from 'sequelize';
import BookTable from './books';

export default class AuthorTable extends Model {
  public id!: string;
  public name!: string;

  public createBook!: HasManyCreateAssociationMixin<BookTable>;

  public static initialize(sequelize: Sequelize) {
    this.init({
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
    }, {
      sequelize,
      tableName: 'authors',
      timestamps: false,
    });
    return this;
  }

  public static associate() {
    this.hasMany(BookTable, {
      sourceKey: 'id',
      foreignKey: 'author_id',
    });
  }
}
