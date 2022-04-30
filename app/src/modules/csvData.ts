import fs from 'fs'
import csv from 'csvtojson'
import { Request } from 'express'

import Logger from './logger'
import db from './../db/index'

import { IRequiredKeys, IOptionalKeys } from '../interfaces/IDbColumn'

const logger = new Logger('csvData')

export default class CsvData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private csvData: any

  async setCsvData (file: Express.Multer.File | undefined) {
    if (!file) throw new Error('undefined file') // ファイルが存在しない場合はエラー

    fs.readFile(file.path, 'utf-8', async (err, data) => {
      if (err) throw err
      // csvtojsonを使ってjsonに変換
      this.csvData = await csv().fromString(data)
    })
  }

  deleteCsvData (folderPath: string, noTargetFileName: string) {
    // folderPathにあるファイルを削除
    const files = fs.readdirSync(folderPath)
    files.forEach(file => { if (file !== noTargetFileName) fs.unlinkSync(`${folderPath}/${file}`) })
  }

  async deleteBookInfo () {
    await db.Book.destroy({ where: {} })
    await db.Author.destroy({ where: {} })
    await db.Publisher.destroy({ where: {} })
    logger.info('csvDataをDBから削除しました。')
  }

  getCsvHeaderData () {
    if (!this.csvData) throw new Error('undefined csvData') // csvDataが存在しない場合はエラー
    // csvDataのキーを返す
    return Object.keys(this.csvData[0])
  }

  async addDB (body: Request["body"]) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const data of this.csvData) {

      const authorKey = body.authorName // 著者名が格納されているキー
      const authorId = await this.controllAuthor(data[authorKey]) // 著者名が格納されていない場合新規にレコードを作成

      const publisherKey = body.publisherName // 出版社名が格納されているキー
      const publisherId = await this.controllPublisher(data[publisherKey]) // 出版社名が格納されていない場合新規にレコードを作成

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const insertObj: any = {}

      /* 必須となる項目 */
      const requiredKeys: IRequiredKeys = {
        book_name: data[body.bookName],
        author_id: authorId,
        publisher_id: publisherId,
      }

      /* 任意となる項目 */
      const optionalKeys: IOptionalKeys = {
        isbn: data[body.isbn],
        book_sub_name: data[body.bookSubName],
        ndc: data[body.ndc],
        book_content: data[body.bookContent]
      }

      const attributes = db.Book.getAttributes()
      for (const key of Object.keys(attributes)) {
        insertObj[key] = null
        if (key in requiredKeys) insertObj[key] = requiredKeys[key as keyof typeof requiredKeys]
        if (key in optionalKeys && optionalKeys[key as keyof typeof optionalKeys] !== 'none') insertObj[key] = optionalKeys[key as keyof typeof optionalKeys]
      }

      logger.debug(insertObj)

      await db.Book.create(insertObj)
    }
    logger.info('csvDataをDBに追加しました。')
  }

  /**
   * 著者名が格納されていない場合新規にレコードを作成
   * @param authorName 著者名
   */
  private async controllAuthor (authorName: string) {
    const author = await db.Author.findOne({ where: { name: authorName } })
    if (!author) {
      await db.Author.create({ name: authorName })
      logger.info(`${authorName}を作成しました。`)
    }

    // idを取得
    const authorId = await db.Author.findOne({ where: { name: authorName } })
    if (authorId === null) throw new Error('authorId not found')
    return authorId.id
  }

  /**
   * 出版社名が格納されていない場合新規にレコードを作成
   * @param publisherName 出版社名
   */
   private async controllPublisher (publisherName: string) {
    const author = await db.Publisher.findOne({ where: { name: publisherName } })
    if (!author) {
      await db.Publisher.create({ name: publisherName })
      logger.info(`${publisherName}を作成しました。`)
    }

    // idを取得
    const publisherId = await db.Publisher.findOne({ where: { name: publisherName } })
    if (publisherId === null) throw new Error('publisherId not found')
    return publisherId.id
  }
}
