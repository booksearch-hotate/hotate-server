import EsCsv from './esCsv';
import axios from 'axios';

import {IEsAuthor} from './documents/IEsAuthor';

import esDocuments from './documents/DocumentType';

export default class EsAuthor extends EsCsv {
  constructor(index: esDocuments) {
    super(index);
  }

  /**
   * 著者IDに対応する著者データを削除します。
   * @param authorId 著者ID
   */
  public async delete(authorId: string): Promise<void> {
    await axios.post(`${this.uri}/_delete_by_query?conflicts=proceed&pretty`, {
      query: {
        term: {
          'db_id.keyword': authorId,
        },
      },
    });
  }

  /**
   * 著者に関するドキュメントを新規に登録します。
   * @param doc authorsのドキュメント
   */
  public async create(doc: IEsAuthor) {
    await axios.post(`${this.uri}/_doc`, doc);
  }
}
