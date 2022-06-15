import ElasticSearch from './elasticsearch';
import * as appRoot from 'app-root-path';
import axios from 'axios';
import fs from 'fs';

import {IEsAuthor} from './documents/IEsAuthor';
import {IEsBook} from './documents/IEsBook';
import {IEsPublisher} from './documents/IEsPublisher';

import esDocuments from './documents/DocumentType';


export default class EsCsv extends ElasticSearch {
  private bulkApiPath: string;

  constructor(index: esDocuments) {
    super(index);

    const bulkApiFileName = `${this.index}_bulkapi.json`;
    this.bulkApiPath = `${appRoot.path}/uploads/json/${bulkApiFileName}`;

    this.createBulkApiFile();
  }

  private createBulkApiFile() {
    // bulkApiFileNameのjsonファイルをuploads/json/に作成する
    fs.writeFileSync(this.bulkApiPath, '');
  }

  public insertBulk(doc: IEsPublisher | IEsBook | IEsAuthor): void {
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
}
