import ElasticSearch from './elasticsearch';
import axios from 'axios';
import SearchHistoryModel from '../../domain/model/searchHistoryModel';

export default class EsSearchHistory extends ElasticSearch {
  private total = 0;

  constructor(index: string) {
    super(index);
    this.initSearchHistory();
  }

  private async initSearchHistory() {
    try {
      await axios.get(`${this.uri}`);
    } catch (e) {
      await axios.put(`${this.uri}`);
    }
  }

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
    });
  }

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
    const ids = hits.map((hit: any) => hit._id);
    // searchWordsは除外
    words.splice(words.indexOf(searchWords), 1);
    ids.splice(ids.indexOf(searchWords), 1);

    const tagModels: SearchHistoryModel[] = [];
    for (let i = 0; i < ids.length; i++) {
      const tagModel = new SearchHistoryModel(ids[i], words[i]);
      tagModels.push(tagModel);
    }

    return tagModels;
  }

  public async find(count: number): Promise<SearchHistoryModel[]> {
    const fromVal = count * 10;
    const res = await axios.get(`${this.uri}/_search`, {
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        query: {
          match_all: {},
        },
        from: fromVal,
        size: 10,
      },
    });
    const hits = res.data.hits.hits;

    this.total = res.data.hits.total.value;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const words = hits.map((hit: any) => hit._source.search_words);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ids = hits.map((hit: any) => hit._id);

    const tagModels: SearchHistoryModel[] = [];
    for (let i = 0; i < ids.length; i++) {
      const tagModel = new SearchHistoryModel(ids[i], words[i]);
      tagModels.push(tagModel);
    }

    return tagModels;
  }

  public async delete(id: string): Promise<void> {
    await axios.delete(`${this.uri}/_doc/${id}`);
  }

  get Total(): number {
    return this.total;
  }
}
