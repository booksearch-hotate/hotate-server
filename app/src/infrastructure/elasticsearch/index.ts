import axios from 'axios';
import fs from 'fs';
import * as appRoot from 'app-root-path';

import {isLocal} from '../cli/cmdLine';
import Logger from '../logger/logger';

import {IEsPublisher, IEsBook, IEsAuthor} from './IElasticSearchDocument';

const logger = new Logger('elasticSearch');

export default class ElasticSearch {
  private host: string;
  private index: string;
  private uri: string;
  private bulkApiPath: string;

  constructor(index: string) {
    this.host = isLocal() ? 'localhost:9200' : 'es:9200';
    this.index = index;
    this.uri = `http://${this.host}/${this.index}`;

    const bulkApiFileName = `${this.index}_bulkapi.json`;
    this.bulkApiPath = `${appRoot.path}/uploads/json/${bulkApiFileName}`;

    this.createBulkApiFile();
  }

  private createBulkApiFile() {
    // bulkApiFileNameのjsonファイルをuploads/json/に作成する
    fs.writeFileSync(this.bulkApiPath, '');
  }

  public async create(doc: IEsPublisher | IEsBook | IEsAuthor): Promise<void> {
    const index = {index: {}};
    const body = JSON.stringify(doc);
    const bulkApi = `${JSON.stringify(index)}\n${body}\n`;
    fs.appendFileSync(this.bulkApiPath, bulkApi);
  }

  public async executeBulkApi(): Promise<void> {
    await axios.post(`${this.uri}/_bulk`, fs.readFileSync(this.bulkApiPath), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    this.removeBulkApiFile();
  }

  private removeBulkApiFile() {
    fs.unlinkSync(this.bulkApiPath);
  }

  public async initIndex(): Promise<void> {
    let isNone = false;
    try {
      await axios.get(`${this.uri}`);
    } catch (e) {
      isNone = true;
      logger.info(`${this.index}は存在しません。`);
    }
    if (!isNone) await axios.delete(`${this.uri}`);
    await axios.put(`${this.uri}`);
  }

  public async searchBooks(searchWords: string): Promise<string[]> {
    const res = await axios.get(`${this.uri}/_search`, {
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        query: {
          bool: {
            should: [
              {match: {'book_name': searchWords}},
              {match: {'book_content': searchWords}},
            ],
          },
        },
      },
    });
    const hits = res.data.hits.hits;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ids = hits.map((hit: any) => hit._source.db_id);

    return ids;
  }
}
