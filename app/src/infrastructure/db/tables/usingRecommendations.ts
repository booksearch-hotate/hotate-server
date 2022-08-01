import {Sequelize, Model, DataTypes} from 'sequelize';
import RecommendationTable from './recommendations';
import BookTable from './books';

export default class UsingRecommendationsTable extends Model {
  public id!: number;
  public recommendation_id!: string;
  public book_id!: string;
  public comment!: string;

  public static initialize(sequelize: Sequelize) {
    this.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      recommendation_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      book_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      comment: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    }, {
      sequelize,
      tableName: 'using_recommendations',
      timestamps: false,
    });
    return this;
  }

  public static associate() {
    this.belongsTo(RecommendationTable, {foreignKey: 'recommendation_id', constraints: false});
    this.belongsTo(BookTable, {foreignKey: 'book_id', constraints: false});
  }
}
