import {ObjectId} from 'mongodb';

export type bookDocument = {
  _id?: ObjectId
  id: string;
  isbn: string;
  book_name: string;
  book_sub_name: string;
  author_id: string;
  ndc: number;
  publisher_id: string;
  year: number;
  book_content: string;
}

export const bookCollectionName = 'books';
