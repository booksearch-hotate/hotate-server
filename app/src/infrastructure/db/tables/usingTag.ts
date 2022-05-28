import {Sequelize, Model, DataTypes} from 'sequelize';

export default class UsingTag extends Model {
  public id!: number;
  public tag_id!: string;
  public book_id!: string;

  public static initialize(sequelize: Sequelize) {
    this.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      tag_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      book_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    }, {
      sequelize,
      tableName: 'using_tags',
      timestamps: false,
    });
    return this;
  }
}
