import {Sequelize} from 'sequelize';
import Book from './tables/books';
import Author from './tables/authors';
import Publisher from './tables/publishers';
import Admin from './tables/admin';
import Tag from './tables/tags';
import UsingTag from './tables/usingTags';
import Department from './tables/departments';
import Request from './tables/requests';

import {isLocal} from '../cli/cmdLine';

const sequelize = new Sequelize('hotate', 'root', 'root', {
  host: isLocal() ? 'localhost' : 'mysql',
  dialect: 'mysql',
  logging: false,
});


const db = {
  Book: Book.initialize(sequelize),
  Author: Author.initialize(sequelize),
  Publisher: Publisher.initialize(sequelize),
  Admin: Admin.initialize(sequelize),
  Tag: Tag.initialize(sequelize),
  UsingTag: UsingTag.initialize(sequelize),
  Department: Department.initialize(sequelize),
  Request: Request.initialize(sequelize),
};

// テーブル同士の関係を作成
db.Book.associate();
db.Author.associate();
db.Publisher.associate();
db.Tag.associate();
db.UsingTag.associate();
db.Department.associate();
db.Request.associate();

export default db;
