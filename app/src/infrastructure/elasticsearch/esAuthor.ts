import EsCsv from './esCsv';
import axios from 'axios';

import {IEsAuthor} from './documents/IEsAuthor';

import esDocuments from './documents/documentType';

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

  /**
   * 本のデータを更新します。
   * @param author 本のドキュメント
   */
  public async update(author: IEsAuthor): Promise<void> {
    await axios.post(`${this.uri}/_delete_by_query?conflicts=proceed&pretty`, {
      query: {
        term: {
          'db_id.keyword': author.db_id,
        },
      },
    });

    await axios.post(`${this.uri}/_doc`, author);
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
          bool: {
            must: [{
              wildcard: {
                book_name: `*${word}*`,
              },
            }],
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
