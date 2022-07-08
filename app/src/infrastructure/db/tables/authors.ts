import {Sequelize, Model, DataTypes} from 'sequelize';
import {HasManyCreateAssociationMixin} from 'sequelize';
import Book from './books';

export default class Author extends Model {
  public id!: string;
  public name!: string;

  public createBook!: HasManyCreateAssociationMixin<Book>;

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
    this.hasMany(Book, {
      sourceKey: 'id',
      foreignKey: 'author_id',
    });
  }
}