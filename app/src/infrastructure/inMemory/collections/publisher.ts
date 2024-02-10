import {ObjectId} from "mongodb";

export type publisherDocument = {
  _id?: ObjectId
  id: string;
  name: string | null;
}

export const publisherCollectionName = "publishers";
