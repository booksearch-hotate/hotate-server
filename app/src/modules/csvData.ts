import fs from 'fs'
import csv from 'csvtojson'
import Logger from './logger'
import db from './../db/index'

const logger = new Logger('csvData')

export default class CsvData {
  private csvData: any

  setCsvData (file: Express.Multer.File | undefined) {
    if (!file) throw new Error('undefined file') // ファイルが存在しない場合はエラー

    fs.readFile(file.path, 'utf-8', (err, data) => {
      if (err) throw err
      // csvtojsonを使ってjsonに変換
      csv().fromString(data).then(json => {
        this.csvData = json
      })
    })
  }

  getCsvHeaderData () {
    if (!this.csvData) throw new Error('undefined csvData') // csvDataが存在しない場合はエラー
    // csvDataのキーを返す
    return Object.keys(this.csvData[0])
  }

  async addDB (body: any) {
    for (let i = 0; i < this.csvData.length; i++) {
      const data = this.csvData[i] // データを取得

      const authorKey = body.authorName // 著者名が格納されているキー
      const authorId = await this.controllAuthor(data[authorKey]) // 著者名が格納されていない場合新規にレコードを作成

      const publisherKey = body.publisherName // 出版社名が格納されているキー
      const publisherId = await this.controllPublisher(data[publisherKey]) // 出版社名が格納されていない場合新規にレコードを作成
      logger.debug(`${data[body.isbn]} => ${Number(data[body.isbn] as string)}`)
      try {
        db.Book.create({
          isbn: Number(data[body.isbn] as string),
          book_name: data[body.bookName],
          author_id: authorId,
          publisher_id: publisherId,
          year: data[body.year],
          book_content: data[body.bookContent],
        })
      } catch (err) {
        logger.error(err as string)
      }
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
