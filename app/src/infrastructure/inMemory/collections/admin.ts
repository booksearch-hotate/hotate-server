import {ObjectId} from "mongodb";

export type adminDocument = {
  _id?: ObjectId
  id: string;
  pw: string;
}

export const adminCollectionName = "admin";
