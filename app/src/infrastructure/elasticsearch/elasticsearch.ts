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
    this.initIndex(false).catch((e: any) => {
      logger.error(`Failed to initialize ${this.index}.`);
    });
  }

  public async deleteAll(): Promise<void> {
    await axios.delete(`${this.uri}`);
  }

  public async initIndex(isRemove = true): Promise<void> {
    try {
      await axios.get(`${this.uri}`);
    } catch (e) {
      logger.info(`${this.index}は存在しません。`);
      await axios.put(`${this.uri}`);
      return;
    }
    if (isRemove) return axios.delete(`${this.uri}`);
  }
}
