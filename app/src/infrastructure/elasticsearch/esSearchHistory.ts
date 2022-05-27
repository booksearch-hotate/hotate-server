import ElasticSearch from './elasticsearch';
import axios from 'axios';

export default class EsSearchHistory extends ElasticSearch {
  constructor(index: string) {
    super(index);
    this.initIndex();
  }

  public async add(searchWords: string): Promise<void> {
    // もしも同じ検索ワードがすでに登録されていたらスルー
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
    if (res.data.hits.total.value > 0) return;

    // 追加
    await axios.post(`${this.uri}/_doc`, {
      search_words: searchWords,
    });
  }
}
