import {ObjectId} from "mongodb";

export type usingTagDocument = {
  _id?: ObjectId;
  book_id: string;
  tag_id: string;
}

export const usingTagCollectionName = "usingTagss";
