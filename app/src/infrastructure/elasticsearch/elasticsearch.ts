import axios from "axios";

import {isLocal, isUseAWSES} from "../cli/cmdLine";
import Logger from "../logger/logger";
import dotenv from "dotenv";
import esDocuments from "./documents/documentType";
import PaginationMargin from "../../domain/model/pagination/paginationMargin";

dotenv.config();

/**
 * AWSにデプロイしたElasticsearchを使用する場合は.envの`ES_AWS_HOST`を使用し、
 * ローカルでElasticsearchを使用する場合はlocalhostを使用します。
 * Dockerを使用する場合は`.env`の`ES_DOCKER_NAME`を使用します。
 * @returns ElasticSearchのホスト名
 */
export function getEsHost() {
  if (isUseAWSES()) return `${process.env.ES_AWS_HOST}:${process.env.ES_AWS_PORT}`;
  return `http://${isLocal() ? "localhost" : process.env.ES_DOCKER_NAME}:${process.env.ES_PORT}`;
}

const logger = new Logger("elasticSearch");

export default class ElasticSearch {
  protected host: string;
  protected index: string;
  protected uri: string;

  constructor(index: esDocuments) {
    this.host = getEsHost();

    this.index = index;
    if (isUseAWSES() && isLocal()) this.index += "_dev"; // ローカル環境でAWS上のESにアクセスする際は別のindexを使用する

    this.uri = `${this.host}/${this.index}`;
  }

  public async search(
      pageCount: number,
      margin: PaginationMargin,
      queryShould: any[],
  ): Promise<{ids: string[], total: number}> {
    const FETCH_COUNT = margin.Margin;
    const res = await axios.get(`${this.uri}/_search`, {
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        query: {
          bool: {
            should: queryShould,
          },
        },
        from: pageCount * FETCH_COUNT,
        size: FETCH_COUNT,
        sort: {
          "_score": {
            order: "desc",
          },
        },
      },
    });
    const hits = res.data.hits.hits;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ids = hits.map((hit: any) => hit._source.db_id);

    return {ids, total: res.data.hits.total.value};
  }

  public async likeSearch(
      pageCount: number,
      margin: PaginationMargin,
      wildcard: any,
  ): Promise<{ids: string[], total: number}> {
    const FETCH_COUNT = margin.Margin;

    const res = await axios.get(`${this.uri}/_search`, {
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        query: {
          wildcard,
        },
        from: pageCount * FETCH_COUNT,
        size: FETCH_COUNT,
        sort: {
          "_score": {
            order: "desc",
          },
        },
      },
    });
    const hits = res.data.hits.hits;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ids = hits.map((hit: any) => hit._source.db_id);

    return {ids, total: res.data.hits.total.value};
  }

  /**
   * コンストラクタで指定したindexに対応したデータを**全て削除**します。
   */
  public async deleteAll(): Promise<void> {
    await axios.delete(`${this.uri}`);
  }

  /**
   * 登録されているドキュメントの件数を取得します
   * @returns ドキュメントの件数
   */
  public async fetchDocumentCount(): Promise<number> {
    const res = await axios.get(`${this.uri}/_count`, {
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        query: {
          match_all: {},
        },
      },
    });

    return res.data.count as number;
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
