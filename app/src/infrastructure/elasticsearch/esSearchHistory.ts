import ElasticSearch from './elasticsearch';
import axios from 'axios';
import SearchHistoryModel from '../../domain/model/searchHistoryModel';

import esDocuments from './documents/documentType';

export default class EsSearchHistory extends ElasticSearch {
  private total = 0;

  constructor(index: esDocuments) {
    super(index);
  }

  /**
   * 検索ワードを新規に登録します。
   * @param searchWords 検索ワード
   */
  public async add(searchWords: SearchHistoryModel): Promise<void> {
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
  }

  /**
   * 検索ワードに近い検索履歴の文字列を検索します。
   * @param searchWords 検索ワード
   * @returns 検索履歴のモデル
   */
  public async search(searchWords: string): Promise<SearchHistoryModel[]> {
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

    const tagModels: SearchHistoryModel[] = [];
    for (let i = 0; i < ids.length; i++) {
      const tagModel = new SearchHistoryModel(ids[i], words[i], createdAts[i]);
      tagModels.push(tagModel);
    }

    return tagModels;
  }

  /**
   * ページ数に対応する検索履歴を取得します。
   * @param count ページ数
   * @returns 検索履歴のモデル
   */
  public async find(count: number): Promise<SearchHistoryModel[]> {
    const FETCH_DATA_NUM = 20;
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

    const tagModels: SearchHistoryModel[] = [];
    for (let i = 0; i < ids.length; i++) {
      const tagModel = new SearchHistoryModel(ids[i], words[i], createdAts[i]);
      tagModels.push(tagModel);
    }

    return tagModels;
  }

  /**
   * idに対応するドキュメントを削除します。
   * @param id 検索履歴のid
   */
  public async delete(id: string): Promise<void> {
    await axios.post(`${this.uri}/_delete_by_query?conflicts=proceed&pretty`, {
      query: {
        term: {
          'id.keyword': id,
        },
      },
    });
  }

  get Total(): number {
    return this.total;
  }
}
