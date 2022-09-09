import axios from 'axios';

import {isLocal} from '../cli/cmdLine';
import Logger from '../logger/logger';
import dotenv from 'dotenv';

dotenv.config();

const logger = new Logger('elasticSearch');

export default class ElasticSearch {
  protected host: string;
  protected index: string;
  protected uri: string;

  constructor(index: 'books' | 'authors' | 'publishers' | 'search_history') {
    const port = process.env.ES_PORT;
    this.host = `${isLocal() ? 'localhost' : process.env.ES_DOCKER_NAME}:${port}`;
    this.index = index;
    this.uri = `http://${this.host}/${this.index}`;
  }

  /**
   * コンストラクタで指定したindexに対応したデータを**全て削除**します。
   */
  public async deleteAll(): Promise<void> {
    await axios.delete(`${this.uri}`);
  }

  /**
   * indexが存在しない場合は新規作成し、存在する場合はindex内のデータを**削除**する処理です。
   *
   * 引数として`false`を渡すことで、indexが存在する場合でもindex内のデータを削除しないようになります。
   *
   * @param isRemove indexが存在する場合、index内のデータを削除するか
   */
  public async initIndex(isRemove = true): Promise<void> {
    try {
      await axios.get(`${this.uri}`);
    } catch (e) {
      logger.info(`${this.index} does not exist.`);

      await axios.put(`${this.uri}`);

      return;
    }

    if (isRemove) return axios.delete(`${this.uri}`);
  }
}
