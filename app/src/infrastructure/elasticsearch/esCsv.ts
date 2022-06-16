import ElasticSearch from './elasticsearch';
import * as appRoot from 'app-root-path';
import axios from 'axios';
import fs from 'fs';

import {IEsAuthor} from './documents/IEsAuthor';
import {IEsBook} from './documents/IEsBook';
import {IEsPublisher} from './documents/IEsPublisher';

import esDocuments from './documents/DocumentType';

/**
 * csvファイルからbulk apiを作成する関係のクラスです。
 */
export default class EsCsv extends ElasticSearch {
  private bulkApiPath: string; // bulk apiを作成するパス

  constructor(index: esDocuments) {
    super(index);

    const bulkApiFileName = `${this.index}_bulkapi.json`;
    this.bulkApiPath = `${appRoot.path}/uploads/json/${bulkApiFileName}`;

    this.createBulkApiFile(); // ファイル生成
  }

  /**
   * bulk apiのファイルを生成します。
   */
  private createBulkApiFile() {
    // bulkApiFileNameのjsonファイルをuploads/json/に作成する
    fs.writeFileSync(this.bulkApiPath, '');
  }

  /**
   * ドキュメントを**引数そのまま**文字列に変換し、bulk apiに追加します。
   * @param doc ドキュメント
   */
  public insertBulk(doc: IEsPublisher | IEsBook | IEsAuthor): void {
    const index = {index: {}};
    const body = JSON.stringify(doc);
    const bulkApi = `${JSON.stringify(index)}\n${body}\n`;
    fs.appendFileSync(this.bulkApiPath, bulkApi);
  }

  /**
   * bulk apiを実行します。
   */
  public async executeBulkApi(): Promise<void> {
    await axios.post(`${this.uri}/_bulk`, fs.readFileSync(this.bulkApiPath), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    this.removeBulkApiFile();
  }

  /**
   * bulk apiのファイルを削除します。
   */
  private removeBulkApiFile() {
    fs.unlinkSync(this.bulkApiPath);
  }
}
