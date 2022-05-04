import { Sequelize } from "sequelize"
import Book from "./book"
import Author from "./author"
import Publisher from "./publisher"

import { isLocal } from "../../modules/cmdLine"

const sequelize = new Sequelize('hotate', 'root', 'root', {
  host: isLocal() ? 'localhost' : 'mysql',
  dialect: 'mysql',
  logging: false
})

const db = {
  Book: Book.initialize(sequelize),
  Author: Author.initialize(sequelize),
  Publisher: Publisher.initialize(sequelize)
}

// テーブル同士の関係を作成
db.Book.associate()
db.Author.associate()
db.Publisher.associate()

export default db
