/**
 * booksで使われているdocumentのフィールド
 */
export interface IEsBook {
  db_id?: number,
  book_name?: string,
  book_content?: string,
}

export interface IEsPublisher {
  db_id?: number,
  name?: string,
}

export interface IEsAuthor {
  db_id?: number,
  name?: string,
}
