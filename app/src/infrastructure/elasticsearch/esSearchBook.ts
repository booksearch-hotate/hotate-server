import EsCsv from './esCsv';
import axios from 'axios';

import {IEsBook} from './IElasticSearchDocument';

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

  public async update(book: IEsBook): Promise<void> {
    await axios.post(`${this.uri}/_delete_by_query?conflicts=proceed&pretty`, {
      query: {
        term: {
          'db_id': book.db_id,
        },
      },
    });

    await axios.post(`${this.uri}/_doc`, {
      db_id: book.db_id,
      book_name: book.book_name,
      book_content: book.book_content,
    });
  }

  get Total(): number {
    return this.total;
  }
}
