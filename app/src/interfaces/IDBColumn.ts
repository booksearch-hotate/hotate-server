/* 必須となる項目 */
export interface IRequiredKeys {
  book_name: string,
  author_id: number,
  publisher_id: number,
}

/* 任意となる項目 */
export interface IOptionalKeys {
  isbn?: string,
  book_sub_name?: string,
  ndc?: number,
  year?: number,
  book_content?: string
}
