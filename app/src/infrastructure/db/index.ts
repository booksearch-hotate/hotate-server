import {Sequelize} from 'sequelize';
import Book from './tables/book';
import Author from './tables/author';
import Publisher from './tables/publisher';
import Admin from './tables/admin';
import Tag from './tables/tag';
import UsingTag from './tables/usingTag';
import Department from './tables/departments';

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
};

// テーブル同士の関係を作成
db.Book.associate();
db.Author.associate();
db.Publisher.associate();
db.Tag.associate();
db.UsingTag.associate();

export default db;
