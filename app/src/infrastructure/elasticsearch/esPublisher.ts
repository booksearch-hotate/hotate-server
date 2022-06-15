import EsCsv from './esCsv';
import axios from 'axios';

import {IEsPublisher} from './documents/IEsPublisher';

import esDocuments from './documents/DocumentType';

export default class EsPublisher extends EsCsv {
  constructor(index: esDocuments) {
    super(index);
  }

  public async delete(publisherId: string): Promise<void> {
    await axios.post(`${this.uri}/_delete_by_query?conflicts=proceed&pretty`, {
      query: {
        term: {
          'db_id.keyword': publisherId,
        },
      },
    });
  }

  public async create(doc: IEsPublisher) {
    await axios.post(`${this.uri}/_doc`, doc);
  }
}
