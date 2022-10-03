import {ObjectId} from 'mongodb';

export type tagDocument = {
  _id?: ObjectId;
  id: string;
  name: string;
}

export const tagCollectionName = 'tags';
