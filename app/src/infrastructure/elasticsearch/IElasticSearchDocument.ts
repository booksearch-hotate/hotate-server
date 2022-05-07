/**
 * booksで使われているdocumentのフィールド
 */
export interface IEsBook {
  db_id?: string,
  book_name?: string,
  book_content?: string,
}

export interface IEsPublisher {
  db_id?: string,
  name?: string,
}

export interface IEsAuthor {
  db_id?: string,
  name?: string,
}
