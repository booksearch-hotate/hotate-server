import {Sequelize, Model, DataTypes, ModelAttributes} from 'sequelize';

import Publisher from './publisher';
import Author from './author';

import {IRequiredKeys, IOptionalKeys} from '../IDbColumn';

const initColumn: IRequiredKeys & IOptionalKeys = {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    autoIncrement: true,
  },
  isbn: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
  },
  book_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  book_sub_name: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
  },
  author_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ndc: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null,
  },
  publisher_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null,
  },
  book_content: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
  },
};

export default class Book extends Model {
  public id!: string;
  public isbn!: string;
  public book_name!: string;
  public book_sub_name!: string;
  public author_id!: string;
  public ndc!: number;
  public publisher_id!: string;
  public year!: number;
  public book_content!: string;
  public created_at!: Date;
  public updated_at!: Date;

  public static initialize(sequelize: Sequelize) {
    this.init(initColumn as unknown as ModelAttributes, {
      sequelize,
      tableName: 'books',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    });
    return this;
  }

  public static associate() {
    this.belongsTo(Publisher, {foreignKey: 'publisher_id', constraints: false});
    this.belongsTo(Author, {foreignKey: 'author_id', constraints: false});
  }
}
