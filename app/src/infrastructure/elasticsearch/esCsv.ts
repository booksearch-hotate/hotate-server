import ElasticSearch from './elasticsearch';
import * as appRoot from 'app-root-path';
import axios from 'axios';
import fs from 'fs';

import {IEsAuthor} from './documents/IEsAuthor';
import {IEsBook} from './documents/IEsBook';
import {IEsPublisher} from './documents/IEsPublisher';

import esDocuments from './documents/documentType';
import Logger from '../logger/logger';

const logger = new Logger('ElasticsearchBulkApiByCsv');

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
    try {
      const file = fs.readFileSync(this.bulkApiPath);

      if (file.toString().length === 0) {
        logger.trace('Skipped execute bulk api because of file\'s content is empty.');
        this.removeBulkApiFile();
        return;
      }

      await axios.post(`${this.uri}/_bulk`, file, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      this.removeBulkApiFile();
    } catch (e: any) {
      if (e instanceof Error) logger.error(e.message);
      else throw e;
    }
  }

  /**
   * bulk apiのファイルを削除します。
   */
  private removeBulkApiFile() {
    fs.unlinkSync(this.bulkApiPath);
  }
}
