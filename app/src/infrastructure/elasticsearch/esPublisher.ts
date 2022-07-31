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

  public async search(name: string): Promise<string[]> {
    const res = await axios.get(`${this.uri}/_search`, {
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        query: {
          match: {
            name,
          },
        },
      },
    });
    const hits = res.data.hits.hits;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ids = hits.map((hit: any) => hit._source.db_id);

    return ids;
  }

  public async searchUsingLike(word: string): Promise<string[]> {
    const res = await axios.get(`${this.uri}/_search`, {
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        query: {
          wildcard: {
            'name.keyword': `*${word}*`,
          },
        },
        sort: {
          '_score': {
            order: 'desc',
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
