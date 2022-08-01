import {Sequelize, Model, DataTypes, ModelAttributes} from 'sequelize';

import PublisherTable from './publishers';
import AuthorTable from './authors';
import UsingRecommendationsTable from './usingRecommendations';


interface IAttributeObj {
  type: DataTypes.DataType,
  primaryKey?: boolean,
  autoIncrement?: boolean,
  allowNull?: boolean,
  defaultValue?: unknown,
}

/* 必須となる項目 */
interface IRequiredKeys {
  id?: IAttributeObj,
  book_name: string | IAttributeObj,
  author_id: number | IAttributeObj,
  publisher_id: number | IAttributeObj
}

/* 任意となる項目 */
interface IOptionalKeys {
  isbn?: string | IAttributeObj | null,
  book_sub_name?: string | IAttributeObj | null,
  ndc?: number | IAttributeObj | null,
  year?: number | IAttributeObj | null,
  book_content?: string | IAttributeObj | null,
  img_name?: string | IAttributeObj | null,
}


const initColumn: IRequiredKeys & IOptionalKeys = {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    autoIncrement: true,
  },
  isbn: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
  },
  book_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  book_sub_name: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
  },
  author_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ndc: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null,
  },
  publisher_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null,
  },
  book_content: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
  },
};

export default class BookTable extends Model {
  public id!: string;
  public isbn!: string;
  public book_name!: string;
  public book_sub_name!: string;
  public author_id!: string;
  public ndc!: number;
  public publisher_id!: string;
  public year!: number;
  public book_content!: string;
  public created_at!: Date;
  public updated_at!: Date;

  public static initialize(sequelize: Sequelize) {
    this.init(initColumn as unknown as ModelAttributes, {
      sequelize,
      tableName: 'books',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    });
    return this;
  }

  public static associate() {
    this.belongsTo(PublisherTable, {foreignKey: 'publisher_id', constraints: false});
    this.belongsTo(AuthorTable, {foreignKey: 'author_id', constraints: false});

    this.hasMany(UsingRecommendationsTable, {
      sourceKey: 'id',
      foreignKey: 'book_id',
    });
  }
}
