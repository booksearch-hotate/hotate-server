import {ObjectId} from "mongodb";

export type bookDocument = {
  _id?: ObjectId
  id: string;
  isbn: string | null;
  book_name: string;
  book_sub_name: string | null;
  author_id: string;
  ndc: number | null;
  publisher_id: string;
  year: number | null;
  book_content: string | null;
}

export const bookCollectionName = "books";
