import { Sequelize, Model, DataTypes } from 'sequelize';
import Publisher from './publisher';
import Author from './author';

export default class Book extends Model {
  public id!: number;
  public name!: string;

  public static initialize (sequelize: Sequelize) {
    this.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      isbn: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      book_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      bok_sub_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      author_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      ndc: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      publisher_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      book_content: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    }, {
      sequelize,
      tableName: 'publishers',
      timestamps: false
    });
    return this
  }

  public static associate () {
    this.belongsTo(Publisher, { foreignKey: 'publisher_id', constraints: false })
    this.belongsTo(Author, { foreignKey: 'author_id', constraints: false })
  }
}
