import ElasticSearch from './elasticsearch';
import * as appRoot from 'app-root-path';
import axios from 'axios';
import fs from 'fs';

import {IEsPublisher, IEsBook, IEsAuthor} from './IElasticSearchDocument';


export default class EsCsv extends ElasticSearch {
  private bulkApiPath: string;

  constructor(index: string) {
    super(index);

    const bulkApiFileName = `${this.index}_bulkapi.json`;
    this.bulkApiPath = `${appRoot.path}/uploads/json/${bulkApiFileName}`;

    this.createBulkApiFile();
  }

  private createBulkApiFile() {
    // bulkApiFileNameのjsonファイルをuploads/json/に作成する
    fs.writeFileSync(this.bulkApiPath, '');
  }

  public create(doc: IEsPublisher | IEsBook | IEsAuthor): void {
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
