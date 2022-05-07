import { Sequelize, Model, DataTypes } from 'sequelize'

export default class Admin extends Model {
  public id!: string
  public pw!: string

  public static initialize (sequelize: Sequelize) {
    this.init({
      id: {
        type: DataTypes.STRING,
        primaryKey: true
      },
      pw: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    }, {
      sequelize,
      tableName: 'admin',
      timestamps: false
    })
    return this
  }
}
