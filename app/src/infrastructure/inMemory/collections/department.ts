import {ObjectId} from 'mongodb';

export type departmentDocument = {
  _id?: ObjectId
  id: string;
  name: string;
}

export const departmentCollectionName = 'departments';
