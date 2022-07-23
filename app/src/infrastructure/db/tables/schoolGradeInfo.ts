import {Sequelize, Model, DataTypes} from 'sequelize';

export default class SchoolGradeInfo extends Model {
  public id!: number;
  public year!: number;
  public school_class!: number;

  public static initialize(sequelize: Sequelize) {
    this.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      year: {
        type: DataTypes.INTEGER,
      },
      school_class: {
        type: DataTypes.INTEGER,
      },
    }, {
      sequelize,
      tableName: 'school_grade_info',
      timestamps: false,
    });
    return this;
  }
}
