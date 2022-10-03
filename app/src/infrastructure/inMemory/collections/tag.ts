import {ObjectId} from 'mongodb';

export type tagDocument = {
  _id?: ObjectId;
  id: string;
  name: string;
  createdAt: Date;
}

export const tagCollectionName = 'tags';
