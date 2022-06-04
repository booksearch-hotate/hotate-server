import EsCsv from './esCsv';
import axios from 'axios';

export default class EsSearchBook extends EsCsv {
  private total = 0;

  constructor(index: string) {
    super(index);
  }

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

  get Total(): number {
    return this.total;
  }
}
