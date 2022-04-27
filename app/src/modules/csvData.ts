import fs from 'fs'
import csv from 'csvtojson'

export default class CsvData {
  private csvData: unknown

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
}
