import EsCsv from './esCsv';
import axios from 'axios';

import {IEsBook} from './documents/IEsBook';

import esDocuments from './documents/documentType';
import PaginationMargin from '../../domain/model/pagination/paginationMarginModel';

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
   * @returns {string[]} 検索結果のID
   */
  public async searchBooks(searchWords: string, pageCount: number, margin: PaginationMargin): Promise<{ids: string[], total: number}> {
    const FETCH_COUNT = margin.Margin;
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
        from: pageCount * FETCH_COUNT,
        size: FETCH_COUNT,
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

    return {ids, total: res.data.hits.total.value};
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

  public async searchUsingLike(word: string, pageCount: number, margin: PaginationMargin): Promise<{ids: string[], total: number}> {
    const FETCH_COUNT = margin.Margin;

    const res = await axios.get(`${this.uri}/_search`, {
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        query: {
          wildcard: {
            'book_name.keyword': `*${word}*`,
          },
        },
        from: pageCount * FETCH_COUNT,
        size: FETCH_COUNT,
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

    return {ids, total: res.data.hits.total.value};
  }

  get Total(): number {
    return this.total;
  }
}
