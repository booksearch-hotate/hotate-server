import EsCsv from './esCsv';
import axios from 'axios';

import {IEsPublisher} from './documents/IEsPublisher';

import esDocuments from './documents/documentType';

export default class EsPublisher extends EsCsv {
  constructor(index: esDocuments) {
    super(index);
  }

  /**
   * dbのidに対応した出版社ドキュメントを削除します。
   * @param publisherId 出版社のdbのid
   */
  public async delete(publisherId: string): Promise<void> {
    await axios.post(`${this.uri}/_delete_by_query?conflicts=proceed&pretty`, {
      query: {
        term: {
          'db_id.keyword': publisherId,
        },
      },
    });
  }

  /**
   * 出版社のドキュメントを新規に登録します。
   * @param doc 出版社のドキュメント
   */
  public async create(doc: IEsPublisher) {
    await axios.post(`${this.uri}/_doc`, doc);
  }

  /**
   * 本のデータを更新します。
   * @param publisher 本のドキュメント
   */
  public async update(publisher: IEsPublisher): Promise<void> {
    await axios.post(`${this.uri}/_delete_by_query?conflicts=proceed&pretty`, {
      query: {
        term: {
          'db_id.keyword': publisher.db_id,
        },
      },
    });

    await axios.post(`${this.uri}/_doc`, publisher);
  }
}
