import EsCsv from "./esCsv";
import axios from "axios";

import {IEsAuthor} from "./documents/IEsAuthor";

import esDocuments from "./documents/documentType";
import PaginationMargin from "../../domain/model/pagination/paginationMargin";

export default class EsAuthor extends EsCsv {
  constructor(index: esDocuments) {
    super(index);
  }

  /**
   * 著者IDに対応する著者データを削除します。
   * @param authorId 著者ID
   */
  public async delete(authorId: string): Promise<void> {
    await axios.post(`${this.uri}/_delete_by_query?conflicts=proceed&pretty`, {
      query: {
        term: {
          "db_id.keyword": authorId,
        },
      },
    });
  }

  public async deleteById(id: string): Promise<void> {
    await this.deleteByIds([id]);
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
   * 著者に関するドキュメントを新規に登録します。
   * @param doc authorsのドキュメント
   */
  public async create(doc: IEsAuthor) {
    await axios.post(`${this.uri}/_doc`, doc);
  }

  /**
   * 本のデータを更新します。
   * @param author 本のドキュメント
   */
  public async update(author: IEsAuthor): Promise<void> {
    await axios.post(`${this.uri}/_delete_by_query?conflicts=proceed&pretty`, {
      query: {
        term: {
          "db_id.keyword": author.db_id,
        },
      },
    });

    await axios.post(`${this.uri}/_doc`, author);
  }

  public async searchAuthor(
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
      return await this.search(pageCount, margin, [
        {
          match: {
            name,
          },
        },
      ]);
    }
  }
}
