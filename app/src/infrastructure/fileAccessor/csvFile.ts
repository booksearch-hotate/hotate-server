import fs from 'fs'
import path from 'path'
import csv from 'csvtojson'

import ICsvFile from "./ICsvFile"

export default class CsvFile implements ICsvFile {
  private file!: Express.Multer.File

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async getFileContent (): Promise<any> {
    const data = await csv().fromFile(this.file.path, { encoding: 'utf-8' })
    // dataの中にundefinedがある場合はnullに変換する
    data.forEach((row: any) => {
      Object.keys(row).forEach((key: string) => {
        if (row[key] === undefined || row[key] === '') row[key] = null
      })
    })
    return data
  }

  public deleteFiles (): void {
    fs.unlinkSync(this.file.path)
  }

  public async getHeaderNames (): Promise<string[]> {
    const csvData = await this.getFileContent()
    return Object.keys(csvData[0])
  }

  set File (file: Express.Multer.File | undefined) {
    if (!file || path.extname(file.originalname) !== '.csv') throw new Error('undefined file')
    this.file = file
  }
}
