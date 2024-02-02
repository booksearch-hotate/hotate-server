import fs from 'fs';
import path from 'path';
import csv from 'csvtojson';
import {DomainInvalidError, InvalidDataTypeError} from '../../presentation/error';
import jschardet from 'jschardet';
import iconv from 'iconv';

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

    if (!data.length) throw new DomainInvalidError('csvファイルが空です。');

    if (data.length > maxLen) {
      throw new DomainInvalidError(`csvファイルの行数が${maxLen}行を超えています。現在の行数: ${data.length}行`);
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

  /**
   * アップロードされたファイルをutf-8に変換
   */
  public convertUtf8(): void {
    const rawFile = fs.readFileSync(this.file.path);

    const detectResult = jschardet.detect(rawFile);

    const iconvFile = new iconv.Iconv(detectResult.encoding, 'UTF-8//TRANSLIT//IGNORE');
    const convertFile = iconvFile.convert(rawFile).toString();

    fs.writeFileSync(this.file.path, convertFile); // 変換済のファイルを上書き
  }

  set File(file: Express.Multer.File | undefined) {
    if (!file || path.extname(file.originalname) !== '.csv') {
      throw new InvalidDataTypeError('ファイルの形式が不正です。csvファイルをアップロードしてください。');
    }
    this.file = file;
  }
  get File(): Express.Multer.File {
    return this.file;
  }
}
