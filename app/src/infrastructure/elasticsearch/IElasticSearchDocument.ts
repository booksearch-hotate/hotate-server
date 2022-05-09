/**
 * booksで使われているdocumentのフィールド
 */
export interface IEsBook {
  db_id?: string,
  book_name?: string,
  book_content?: string | null,
}

export interface IEsPublisher {
  db_id?: string,
  name?: string | null,
}

export interface IEsAuthor {
  db_id?: string,
  name?: string | null,
}
