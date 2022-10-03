import {ObjectId} from 'mongodb';

export type publisherDocument = {
  _id?: ObjectId
  id: string;
  name: string;
}

export const publisherCollectionName = 'publishers';
