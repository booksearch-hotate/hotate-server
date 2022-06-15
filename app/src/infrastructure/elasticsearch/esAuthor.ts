import EsCsv from './esCsv';
import axios from 'axios';

import {IEsAuthor} from './documents/IEsAuthor';

import esDocuments from './documents/DocumentType';

export default class EsAuthor extends EsCsv {
  constructor(index: esDocuments) {
    super(index);
  }

  public async delete(authorId: string): Promise<void> {
    await axios.post(`${this.uri}/_delete_by_query?conflicts=proceed&pretty`, {
      query: {
        term: {
          'db_id.keyword': authorId,
        },
      },
    });
  }

  public async create(doc: IEsAuthor) {
    await axios.post(`${this.uri}/_doc`, doc);
  }
}
