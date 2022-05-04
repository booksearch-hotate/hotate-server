import { Sequelize, Model, DataTypes, ModelAttributes } from 'sequelize'

import Publisher from './publisher'
import Author from './author'

import { IRequiredKeys, IOptionalKeys } from '../../interfaces/IDbColumn'

const initColumn: IRequiredKeys & IOptionalKeys = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
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
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ndc: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null,
  },
  publisher_id: {
    type: DataTypes.INTEGER,
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
  }
}

export default class Book extends Model {
  public id!: number
  public isbn!: string
  public book_name!: string
  public book_sub_name!: string
  public author_id!: number
  public ndc!: number
  public publisher_id!: number
  public year!: number
  public book_content!: string

  public static initialize (sequelize: Sequelize) {
    this.init(initColumn as unknown as ModelAttributes, {
      sequelize,
      tableName: 'books',
      timestamps: false
    })
    return this
  }

  public static associate () {
    this.belongsTo(Publisher, { foreignKey: 'publisher_id', constraints: false })
    this.belongsTo(Author, { foreignKey: 'author_id', constraints: false })
  }
}
