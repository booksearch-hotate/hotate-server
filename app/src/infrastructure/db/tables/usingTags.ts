import {Sequelize, Model, DataTypes} from 'sequelize';
import TagTable from './tags';
import BookTable from './books';

export default class UsingTagTable extends Model {
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

  public static associate() {
    this.belongsTo(TagTable, {foreignKey: 'tag_id', constraints: false});
    this.belongsTo(BookTable, {foreignKey: 'book_id', constraints: false});
  }
}
