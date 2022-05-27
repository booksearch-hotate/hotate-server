import ElasticSearch from './elasticsearch';
import axios from 'axios';

export default class EsSearchHistory extends ElasticSearch {
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

  public async add(searchWords: string): Promise<void> {
    // もしも同じ検索ワードがすでに登録されていたらスルー
    const res = await axios.get(`${this.uri}/_search`, {
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        query: {
          term: {
            'search_words.keyword': searchWords,
          },
        },
      },
    });
    if (res.data.hits.hits.length > 0) return;

    // 追加
    await axios.post(`${this.uri}/_doc`, {
      search_words: searchWords,
    });
  }

  public async search(searchWords: string): Promise<string[]> {
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
    // searchWordsは除外
    words.splice(words.indexOf(searchWords), 1);

    return words;
  }
}
