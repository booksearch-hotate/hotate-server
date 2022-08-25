import ElasticSearch from './elasticsearch';
import axios from 'axios';
import SearchHistory from '../../domain/model/searchHistory/searchHistory';

import esDocuments from './documents/documentType';
import PaginationMargin from '../../domain/model/pagination/paginationMargin';

import Logger from '../logger/logger';

const logger = new Logger('esSearchHistory');

export default class EsSearchHistory extends ElasticSearch {
  private total = 0;

  constructor(index: esDocuments) {
    super(index);
  }

  /**
   * 検索ワードを新規に登録します。
   * @param searchWords 検索ワード
   */
  public async add(searchWords: SearchHistory): Promise<void> {
    // もしも同じ検索ワードがすでに登録されていたらスルー
    const res = await axios.get(`${this.uri}/_search`, {
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        query: {
          term: {
            'search_words.keyword': searchWords.Words,
          },
        },
      },
    });
    if (res.data.hits.hits.length > 0) return;

    // 追加
    await axios.post(`${this.uri}/_doc`, {
      search_words: searchWords.Words,
      id: searchWords.Id,
      created_at: searchWords.CreatedAt,
    });

    logger.info(`Added new search words: ${searchWords.Words}`);
  }

  /**
   * 検索ワードに近い検索履歴の文字列を検索します。
   * @param searchWords 検索ワード
   * @returns 検索履歴のモデル
   */
  public async search(searchWords: string): Promise<SearchHistory[]> {
    const res = await axios.get(`${this.uri}/_search`, {
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        query: {
          match: {
            search_words: searchWords,
          },
        },
      },
    });
    const hits = res.data.hits.hits;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const words = hits.map((hit: any) => hit._source.search_words);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ids = hits.map((hit: any) => hit._source.id);

    const createdAts = hits.map((hit: any) => hit._source.created_at);
    // searchWordsは除外
    words.splice(words.indexOf(searchWords), 1);
    ids.splice(ids.indexOf(searchWords), 1);
    createdAts.splice(createdAts.indexOf(searchWords), 1);

    const tagModels: SearchHistory[] = [];
    for (let i = 0; i < ids.length; i++) {
      const tagModel = new SearchHistory(ids[i], words[i], createdAts[i]);
      tagModels.push(tagModel);
    }

    return tagModels;
  }

  /**
   * ページ数に対応する検索履歴を取得します。
   * @param count ページ数
   * @returns 検索履歴のモデル
   */
  public async find(count: number, margin: PaginationMargin): Promise<SearchHistory[]> {
    const FETCH_DATA_NUM = margin.Margin;
    const fromVal = count * FETCH_DATA_NUM;
    const res = await axios.get(`${this.uri}/_search`, {
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        query: {
          match_all: {},
        },
        from: fromVal,
        size: FETCH_DATA_NUM,
        sort: {
          'created_at': {
            order: 'desc',
          },
        },
      },
    });
    const hits = res.data.hits.hits;

    this.total = res.data.hits.total.value;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const words = hits.map((hit: any) => hit._source.search_words);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ids = hits.map((hit: any) => hit._source.id);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const createdAts = hits.map((hit: any) => hit._source.created_at);

    const tagModels: SearchHistory[] = [];
    for (let i = 0; i < ids.length; i++) {
      const tagModel = new SearchHistory(ids[i], words[i], createdAts[i]);
      tagModels.push(tagModel);
    }

    return tagModels;
  }

  /**
   * idに対応するドキュメントを削除します。
   * @param id 検索履歴のid
   */
  public async delete(id: string): Promise<void> {
    const startTimer = performance.now();

    await axios.post(`${this.uri}/_delete_by_query?conflicts=proceed&pretty`, {
      query: {
        term: {
          'id.keyword': id,
        },
      },
    });

    const endTimer = performance.now();

    // データが即時に反映されるわけではないのでそのクールタイムを追加
    const coolTime = 500 - (endTimer - startTimer);
    await new Promise((resolve) => setTimeout(resolve, coolTime));

    logger.info(`Succeed delete search history. id: ${id}`);
  }

  get Total(): number {
    return this.total;
  }
}
