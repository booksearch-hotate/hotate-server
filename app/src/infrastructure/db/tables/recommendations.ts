import {Sequelize, Model, DataTypes} from 'sequelize';
import UsingRecommendations from './usingRecommendations';

export default class Recommendation extends Model {
  public id!: string;
  public title!: string;
  public content!: string;
  public is_solid!: number;
  public index!: number;

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
      index: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    }, {
      sequelize,
      tableName: 'recommendations',
      timestamps: true,
    });
    return this;
  }

  public static associate() {
    this.hasMany(UsingRecommendations, {
      sourceKey: 'id',
      foreignKey: 'recommendation_id',
    });
  }
}
