import {ObjectId} from 'mongodb';
import Department from '../../../domain/model/department/department';

export type requestDocument = {
  _id?: ObjectId
  id: string;
  bookName: string;
  authorName: string;
  publisherName: string;
  isbn: string;
  message: string;
  department: Department;
  schoolYear: string;
  schoolClass: string;
  userName: string;
  createdAt: Date;
}

export const bookRequestCollectionName = 'requests';
