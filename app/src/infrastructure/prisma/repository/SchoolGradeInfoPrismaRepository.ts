import {PrismaClient} from "@prisma/client";
import SchoolGradeInfo from "../../../domain/model/schoolGradeInfo/schoolGradeInfo";
import {ISchoolGradeInfoDBRepository} from "../../../domain/repository/db/ISchoolGradeInfoDBRepository";
import SchoolYear from "../../../domain/model/schoolGradeInfo/schoolYear";
import SchoolClass from "../../../domain/model/schoolGradeInfo/schoolClass";

export default class SchoolGradeInfoPrismaRepository implements ISchoolGradeInfoDBRepository {
  private readonly db: PrismaClient;

  public constructor(db: PrismaClient) {
    this.db = db;
  }

  public async find(): Promise<SchoolGradeInfo | null> {
    const schoolGradeInfo = await this.db.school_grade_info.findFirst();

    if (schoolGradeInfo === null) {
      return null;
    }

    return new SchoolGradeInfo(
        new SchoolYear(schoolGradeInfo.year),
        new SchoolClass(schoolGradeInfo.school_class),
    );
  }

  public async update(SchoolGradeInfo: SchoolGradeInfo): Promise<void> {
    await this.db.school_grade_info.updateMany({
      data: {
        year: SchoolGradeInfo.Year,
        school_class: SchoolGradeInfo.SchoolClass,
      },
    });
  }
}
