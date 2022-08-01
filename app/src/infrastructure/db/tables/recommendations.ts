import {Sequelize, Model, DataTypes} from 'sequelize';
import UsingRecommendationsTable from './usingRecommendations';

export default class RecommendationTable extends Model {
  public id!: string;
  public title!: string;
  public content!: string;
  public is_solid!: number;
  public sort_index!: number;
  public created_at!: Date;
  public updated_at!: Date;

  public static initialize(sequelize: Sequelize) {
    this.init({
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      is_solid: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      sort_index: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    }, {
      sequelize,
      tableName: 'recommendations',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    });
    return this;
  }

  public static associate() {
    this.hasMany(UsingRecommendationsTable, {
      sourceKey: 'id',
      foreignKey: 'recommendation_id',
    });
  }
}
