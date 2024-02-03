import {Sequelize} from 'sequelize';
import dotenv from 'dotenv';

import BookTable from './tables/books';
import AuthorTable from './tables/authors';
import PublisherTable from './tables/publishers';
import AdminTable from './tables/admin';
import TagTable from './tables/tags';
import UsingTagTable from './tables/usingTags';
import DepartmentTable from './tables/departments';
import RequestTable from './tables/requests';
import UsingRecommendationsTable from './tables/usingRecommendations';
import RecommendationTable from './tables/recommendations';
import SchoolGradeInfoTable from './tables/schoolGradeInfo';

import {isLocal} from '../cli/cmdLine';
import UserTable from './tables/users';

dotenv.config();

const sequelize = new Sequelize('hotate', 'root', 'root', {
  host: isLocal() ? 'localhost' : process.env.MYSQL_DOCKER_NAME,
  dialect: 'mysql',
  logging: false,
});


const db = {
  Book: BookTable.initialize(sequelize),
  Author: AuthorTable.initialize(sequelize),
  Publisher: PublisherTable.initialize(sequelize),
  Admin: AdminTable.initialize(sequelize),
  Tag: TagTable.initialize(sequelize),
  UsingTag: UsingTagTable.initialize(sequelize),
  Department: DepartmentTable.initialize(sequelize),
  Request: RequestTable.initialize(sequelize),
  UsingRecommendations: UsingRecommendationsTable.initialize(sequelize),
  Recommendation: RecommendationTable.initialize(sequelize),
  SchoolGradeInfo: SchoolGradeInfoTable.initialize(sequelize),
  User: UserTable.initialize(sequelize),
};

// テーブル同士の関係を作成
db.Book.associate();
db.Author.associate();
db.Publisher.associate();
db.Tag.associate();
db.UsingTag.associate();
db.Department.associate();
db.Request.associate();
db.UsingRecommendations.associate();
db.Recommendation.associate();

export default db;
