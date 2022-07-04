import {Sequelize, Model, DataTypes} from 'sequelize';

import Department from './departments';

export default class Request extends Model {
  public id!: string;
  public isbn!: string;
  public book_name!: string;
  public author_name!: string;
  public publisher_name!: string;
  public department_id!: number;
  public message!: string;
  public school_year!: string;
  public school_class!:string;
  public user_name!: string;
  public created_at!: Date;

  public static initialize(sequelize: Sequelize) {
    this.init({
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      book_name: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      author_name: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      publisher_name: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      isbn: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      message: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      department_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      school_year: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      school_class: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      user_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    }, {
      sequelize,
      tableName: 'requests',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    });
    return this;
  }
  public static associate() {
    this.belongsTo(Department, {foreignKey: 'department_id', constraints: false});
  }
}
