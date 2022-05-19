import axios from 'axios';

import {isLocal} from '../cli/cmdLine';
import Logger from '../logger/logger';

import {IEsPublisher, IEsBook, IEsAuthor} from './IElasticSearchDocument';

const logger = new Logger('elasticSearch');

export default class ElasticSearch {
  private host: string;
  private index: string;
  private uri: string;

  constructor(index: string) {
    this.host = isLocal() ? 'localhost:9200' : 'es:9200';
    this.index = index;
    this.uri = `http://${this.host}/${this.index}`;
  }

  public async create(doc: IEsPublisher | IEsBook | IEsAuthor): Promise<void> {
    await axios.post(`${this.uri}/_doc/`, doc, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  public async initIndex(): Promise<void> {
    let isNone = false;
    try {
      await axios.get(`${this.uri}`);
    } catch (e) {
      isNone = true;
      logger.info(`${this.index}は存在しません。`);
    }
    if (!isNone) await axios.delete(`${this.uri}`);
    await axios.put(`${this.uri}`);
  }

  public async searchBooks(searchWords: string): Promise<string[]> {
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
      },
    });
    const hits = res.data.hits.hits;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ids = hits.map((hit: any) => hit._source.db_id);

    return ids;
  }
}
