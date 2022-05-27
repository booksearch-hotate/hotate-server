import axios from 'axios';

import {isLocal} from '../cli/cmdLine';
import Logger from '../logger/logger';

const logger = new Logger('elasticSearch');

export default class ElasticSearch {
  protected host: string;
  protected index: string;
  protected uri: string;

  constructor(index: string) {
    this.host = isLocal() ? 'localhost:9200' : 'es:9200';
    this.index = index;
    this.uri = `http://${this.host}/${this.index}`;
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
}
