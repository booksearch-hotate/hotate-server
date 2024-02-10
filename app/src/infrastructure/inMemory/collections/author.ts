import {ObjectId} from "mongodb";

export type authorDocument = {
  _id?: ObjectId
  id: string;
  name: string | null;
}

export const authorCollectionName = "authors";
