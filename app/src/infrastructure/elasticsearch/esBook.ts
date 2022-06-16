import EsCsv from './esCsv';
import axios from 'axios';

import {IEsBook} from './documents/IEsBook';

import esDocuments from './documents/DocumentType';

export default class EsSearchBook extends EsCsv {
  private total = 0; // 検索結果の総数

  constructor(index: esDocuments) {
    super(index);
  }

  /**
   * 検索ワードから検索を行います。ページ数に合わせたデータを取得します。
   *
   * @param searchWords 検索ワード
   * @param pageCount ページ数
   * @returns {string[]} 検索結果
   */
  public async searchBooks(searchWords: string, pageCount: number): Promise<string[]> {
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
        from: pageCount * 10,
        size: 10,
        sort: {
          '_score': {
            order: 'desc',
          },
        },
      },
    });
    const hits = res.data.hits.hits;

    this.total = res.data.hits.total.value;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ids = hits.map((hit: any) => hit._source.db_id);

    return ids;
  }

  /**
   * 本のデータを更新します。
   * @param book 本のドキュメント
   */
  public async update(book: IEsBook): Promise<void> {
    await axios.post(`${this.uri}/_delete_by_query?conflicts=proceed&pretty`, {
      query: {
        term: {
          'db_id.keyword': book.db_id,
        },
      },
    });

    await axios.post(`${this.uri}/_doc`, book);
  }

  /**
   * dbのidに対応する本ドキュメントを削除します。
   * @param id 本のdbのid
   */
  public async delete(id: string): Promise<void> {
    await axios.post(`${this.uri}/_delete_by_query?conflicts=proceed&pretty`, {
      query: {
        term: {
          'db_id.keyword': id,
        },
      },
    });
  }

  get Total(): number {
    return this.total;
  }
}
