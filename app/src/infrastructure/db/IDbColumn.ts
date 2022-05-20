import {DataTypes} from 'sequelize';

export interface IAttributeObj {
  type: DataTypes.DataType,
  primaryKey?: boolean,
  autoIncrement?: boolean,
  allowNull?: boolean,
  defaultValue?: unknown,
}

/* 必須となる項目 */
export interface IRequiredKeys {
  id?: IAttributeObj,
  book_name: string | IAttributeObj,
  author_id: number | IAttributeObj,
  publisher_id: number | IAttributeObj
}

/* 任意となる項目 */
export interface IOptionalKeys {
  isbn?: string | IAttributeObj | null,
  book_sub_name?: string | IAttributeObj | null,
  ndc?: number | IAttributeObj | null,
  year?: number | IAttributeObj | null,
  book_content?: string | IAttributeObj | null,
  img_name?: string | IAttributeObj | null,
}
