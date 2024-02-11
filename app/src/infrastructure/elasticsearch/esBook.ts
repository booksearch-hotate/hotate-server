import EsCsv from "./esCsv";
import axios from "axios";

import {IEsBook} from "./documents/IEsBook";

import esDocuments from "./documents/documentType";
import PaginationMargin from "../../domain/model/pagination/paginationMargin";

export default class EsSearchBook extends EsCsv {
  private total = 0; // 検索結果の総数

  constructor(index: esDocuments) {
    super(index);
  }

  /**
   * 本のデータを更新します。
   * @param book 本のドキュメント
   */
  public async update(book: IEsBook): Promise<void> {
    await axios.post(`${this.uri}/_delete_by_query?conflicts=proceed&pretty`, {
      query: {
        term: {
          "db_id": book.db_id,
        },
      },
    });

    await axios.post(`${this.uri}/_doc`, book);
  }

  /**
   * dbのidに対応する本ドキュメントを削除します。
   * @param id 本のdbのid
   */
  public async delete(id: string): Promise<void> {
    await axios.post(`${this.uri}/_delete_by_query?conflicts=proceed&pretty`, {
      query: {
        term: {
          "db_id": id,
        },
      },
    });
  }

  // TODO: 要検証
  public async deleteAll(): Promise<void> {
    await axios.post(`${this.uri}/_delete_by_query`, {
      query: {
        match_all: {},
      },
    });
  }

  public async searchBook(
      query: string,
      pageCount: number,
      margin: PaginationMargin,
      isLike: boolean,
  ): Promise<{ids: string[], total: number}> {
    if (isLike) {
      return await this.likeSearch(pageCount, margin, {
        "book_name.keyword": `*${query}*`,
      });
    } else {
      return await this.search(pageCount, margin, [
        {
          match: {
            "book_name": {
              query: query,
              boost: 1.5,
            },
          },
        },
        {match: {"book_content": query}},
      ]);
    }
  }

  get Total(): number {
    return this.total;
  }

  public async getIdsByDbIds(dbIds: string[]): Promise<string[]> {
    const res = await axios.get(`${this.uri}/_search`, {
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        query: {
          terms: {
            db_id: dbIds,
          },
        },
        size: dbIds.length,
      },
    });

    const hits = res.data.hits.hits;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ids = hits.map((hit: any) => hit._source.db_id);

    return ids;
  }

  public async getIds(fetchCount: number, margin: number): Promise<string[]> {
    const res = await axios.get(`${this.uri}/_search`, {
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        query: {
          match_all: {},
        },
        from: fetchCount * margin,
        size: margin,
        sort: {
          "db_id": {
            order: "asc",
          },
        },
      },
    });

    const hits = res.data.hits.hits;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ids = hits.map((hit: any) => hit._source.db_id);

    return ids;
  }

  public async removeByDBIds(ids: string[]): Promise<void> {
    await axios.post(`${this.uri}/_delete_by_query`, {
      query: {
        terms: {
          db_id: ids,
        },
      },
    });
  }

  public async create(doc: IEsBook) {
    await axios.post(`${this.uri}/_doc`, doc);
  }

  public async deleteMany(ids: string[]): Promise<void> {
    await axios.post(`${this.uri}/_delete_by_query`, {
      query: {
        terms: {
          db_id: ids,
        },
      },
    });
  }
}
