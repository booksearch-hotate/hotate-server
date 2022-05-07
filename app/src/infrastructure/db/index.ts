import { Sequelize } from "sequelize"
import Book from "./tables/book"
import Author from "./tables/author"
import Publisher from "./tables/publisher"
import Admin from "./tables/admin"

import { isLocal } from "../cli/cmdLine"

const sequelize = new Sequelize('hotate', 'root', 'root', {
  host: isLocal() ? 'localhost' : 'mysql',
  dialect: 'mysql',
  logging: false
})



const db = {
  Book: Book.initialize(sequelize),
  Author: Author.initialize(sequelize),
  Publisher: Publisher.initialize(sequelize),
  Admin: Admin.initialize(sequelize)
}

// テーブル同士の関係を作成
db.Book.associate()
db.Author.associate()
db.Publisher.associate()

export default db
