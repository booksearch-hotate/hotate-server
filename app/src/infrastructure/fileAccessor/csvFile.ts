import fs from 'fs';
import path from 'path';
import csv from 'csvtojson';

export default class CsvFile {
  private file!: Express.Multer.File;

  /**
   * csvファイルを取得します。
   * @returns csvデータ
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async getFileContent(): Promise<any> {
    const data = await csv().fromFile(this.file.path, {encoding: 'utf-8'});

    // dataの中にundefinedがある場合はnullに変換する
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data.forEach((row: any) => {
      Object.keys(row).forEach((key: string) => {
        if (row[key] === undefined || row[key] === '') row[key] = null;
      });
    });

    const maxLen = 5000; // csvファイルの最大行数

    if (!data.length) throw new Error('csv file is empty');

    if (data.length > maxLen) {
      throw new Error(`csv file is too large. max lengh is ${maxLen} but now is ${data.length}`);
    }

    return data;
  }

  /**
   * csvファイルを**削除**します。
   */
  public deleteFiles(): void {
    const folder = path.dirname(this.file.path);
    fs.readdir(folder, (err, files) => {
      if (err) return;
      files.forEach((file) => {
        fs.unlink(path.join(folder, file), (err) => {
          if (err) return;
        });
      });
    });
  }

  /**
   * csvファイルが存在するかどうかの判定を行います。
   * @returns csvファイルが存在するか
   */
  public isExistFile(): boolean {
    return fs.existsSync(this.file.path);
  }

  /**
   * csvファイルのヘッダ部分の文字列を取得します。
   * @returns ヘッダ部分の文字列
   */
  public async getHeaderNames(): Promise<string[]> {
    const csvData = await this.getFileContent();

    // eslint-disable-next-line no-magic-numbers
    return Object.keys(csvData[0]);
  }

  set File(file: Express.Multer.File | undefined) {
    if (!file || path.extname(file.originalname) !== '.csv') {
      throw new Error('undefined file');
    }
    this.file = file;
  }
  get File(): Express.Multer.File {
    return this.file;
  }
}
