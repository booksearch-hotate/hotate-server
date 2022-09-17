import {ObjectId} from 'mongodb';

export type requestDocument = {
  _id?: ObjectId
  id: string;
  bookName: string;
  authorName: string;
  publisherName: string;
  isbn: string;
  message: string;
  department: {
    id: string,
    name: string,
  };
  schoolYear: string;
  schoolClass: string;
  userName: string;
  createdAt: Date;
}

export const bookRequestCollectionName = 'requests';
