import EsCsv from "./esCsv";
import axios from "axios";

import {IEsPublisher} from "./documents/IEsPublisher";

import esDocuments from "./documents/documentType";
import PaginationMargin from "../../domain/model/pagination/paginationMargin";

export default class EsPublisher extends EsCsv {
  constructor(index: esDocuments) {
    super(index);
  }

  /**
   * dbのidに対応した出版社ドキュメントを削除します。
   * @param publisherId 出版社のdbのid
   */
  public async deleteById(publisherId: string): Promise<void> {
    await this.deleteByIds([publisherId]);
  }

  public async deleteByIds(ids: string[]): Promise<void> {
    await axios.post(`${this.uri}/_delete_by_query`, {
      query: {
        term: {
          "db_id": ids,
        },
      },
    });
  }

  /**
   * 出版社のドキュメントを新規に登録します。
   * @param doc 出版社のドキュメント
   */
  public async create(doc: IEsPublisher) {
    await axios.post(`${this.uri}/_doc`, doc);
  }

  /**
   * 本のデータを更新します。
   * @param publisher 本のドキュメント
   */
  public async update(publisher: IEsPublisher): Promise<void> {
    await axios.post(`${this.uri}/_delete_by_query?conflicts=proceed&pretty`, {
      query: {
        term: {
          "db_id.keyword": publisher.db_id,
        },
      },
    });

    await axios.post(`${this.uri}/_doc`, publisher);
  }

  public async searchPublisher(
      name: string,
      pageCount: number,
      margin: PaginationMargin,
      isLike: boolean,
  ): Promise<{ids: string[], total: number}> {
    if (isLike) {
      return await this.likeSearch(pageCount, margin, {
        "name.keyword": `*${name}*`,
      });
    } else {
      return await this.search(pageCount, margin, [{
        match: {
          "name": name,
        },
      }]);
    }
  }
}
