import { Sequelize, Model, DataTypes } from 'sequelize'
import { HasManyCreateAssociationMixin } from 'sequelize'
import Book from './book'

export default class Publisher extends Model {
  public id!: string
  public name!: string

  public createBook!: HasManyCreateAssociationMixin<Book>

  public static initialize (sequelize: Sequelize) {
    this.init({
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    }, {
      sequelize,
      tableName: 'publishers',
      timestamps: false
    })
    return this
  }

  public static associate () {
    this.hasMany(Book, {
      sourceKey: 'id',
      foreignKey: 'publisher_id'
    })
  }
}
