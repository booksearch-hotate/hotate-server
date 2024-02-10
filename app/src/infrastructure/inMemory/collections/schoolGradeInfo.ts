import {ObjectId} from "mongodb";

export type schoolGradeInfoDocument = {
  _id?: ObjectId
  year: number;
  school_class: number;
}

export const SchoolGradeInfoCollectionName = "schoolGradeInfos";
