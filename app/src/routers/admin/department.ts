import {Request, Response, Router} from "express";
import csurf from "csurf";

import DepartmentService from "../../domain/service/departmentService";

import db from "../../infrastructure/prisma/prisma";
import Logger from "../../infrastructure/logger/logger";
import conversionpageStatus from "../../utils/conversionPageStatus";
import {InvalidDataTypeError, NullDataError} from "../../presentation/error";
import DepartmentAdminController from "../../controller/admin/DepartmentController";
import FindAllDepartmentUsecase from "../../usecase/department/FindAllDepartmentUsecase";
import SchoolGradeInfoFindUseCase from "../../usecase/schoolGradeInfo/SchoolGradeInfoFindUsecase";
import SchoolGradeInfoUpdateUsecase from "../../usecase/schoolGradeInfo/SchoolGradeInfoUpdateUsecase";
import SaveDepartmentUseCase from "../../usecase/department/SaveDepartmentUsecase";
import ConfirmDeleteDepartmentUseCase from "../../usecase/department/ConfirmDeleteDepartmentUsecase";
import DeleteDepartmentUsecase from "../../usecase/department/DeleteDepartmentUsecase";
import FindByIdDepartmentUseCase from "../../usecase/department/FindByIdDepartmentUsecase";
import UpdateDepartmentUsecase from "../../usecase/department/UpdateDepartmentUsecase";
import DepartmentPrismaRepository from "../../infrastructure/prisma/repository/DepartmentPrismaRepository";
import SchoolGradeInfoPrismaRepository from "../../infrastructure/prisma/repository/SchoolGradeInfoPrismaRepository";
import BookRequestPrismaRepository from "../../infrastructure/prisma/repository/BookRequestPrismaRepository";

// eslint-disable-next-line new-cap
const departmentRouter = Router();

const csrfProtection = csurf({cookie: false});

const logger = new Logger("department");

const departmentController = new DepartmentAdminController(
    new FindAllDepartmentUsecase(new DepartmentPrismaRepository(db), new DepartmentService(new DepartmentPrismaRepository(db))),
    new SchoolGradeInfoFindUseCase(new SchoolGradeInfoPrismaRepository(db)),
    new SchoolGradeInfoUpdateUsecase(new SchoolGradeInfoPrismaRepository(db)),
    new SaveDepartmentUseCase(new DepartmentPrismaRepository(db), new DepartmentService(new DepartmentPrismaRepository(db))),
    new ConfirmDeleteDepartmentUseCase(new DepartmentPrismaRepository(db), new BookRequestPrismaRepository(db)),
    new DeleteDepartmentUsecase(new DepartmentPrismaRepository(db)),
    new FindByIdDepartmentUseCase(new DepartmentPrismaRepository(db)),
    new UpdateDepartmentUsecase(new DepartmentPrismaRepository(db), new DepartmentService(new DepartmentPrismaRepository(db))),
);

departmentRouter.get("/", csrfProtection, async (req: Request, res: Response) => {
  res.pageData.headTitle = "学科名一覧";

  const response = await departmentController.fetch();

  res.pageData.anyData = {
    departmentList: response.departments,
    isMax: response.isMax,
    schoolGradeInfo: response.schoolGradeInfo,
  };

  res.pageData.status = conversionpageStatus(req.session.status);
  req.session.status = undefined;

  req.session.keepValue = undefined;

  res.pageData.csrfToken = req.csrfToken();

  res.render("pages/admin/school-info/index", {pageData: res.pageData});
});

departmentRouter.post("/grade-info/update", csrfProtection, async (req: Request, res: Response) => {
  try {
    const year = req.body.year;
    const schoolClass = req.body.schoolClass;

    await departmentController.updateSchoolGradeInfo(year, schoolClass);

    req.session.status = {type: "Success", mes: "学年・クラスの変更に成功しました。"};
    logger.info("Grade or class are updated.");
  } catch (e: any) {
    logger.error(e);
    req.session.status = {type: "Failure", error: e, mes: "学年・クラスの変更に失敗しました。"};
  } finally {
    res.redirect("/admin/school-info");
  }
});

departmentRouter.post("/insert", csrfProtection, async (req: Request, res: Response) => {
  try {
    const departmentName = req.body.insertName;

    await departmentController.saveDepartment(departmentName);

    req.session.status = {type: "Success", mes: "学科の追加に成功しました"};
    logger.info(`Department is added. Name: ${departmentName}`);
  } catch (e: any) {
    logger.error(e);
    req.session.status = {type: "Failure", error: e, mes: "学科の追加に失敗しました"};
  } finally {
    res.redirect("/admin/school-info/");
  }
});

departmentRouter.get("/confirm-delete", csrfProtection, async (req: Request, res: Response) => {
  try {
    const departmentId = req.query.did;

    if (typeof departmentId !== "string") throw new InvalidDataTypeError("Invalid request id.");

    const output = await departmentController.confirmDelete(departmentId);

    if (output.department === null) throw new NullDataError("The department content cannot find.");

    res.pageData.headTitle = "学科名の削除";

    res.pageData.anyData = {
      department: output.department,
      bookRequests: output.requests,
    };

    res.pageData.csrfToken = req.csrfToken();

    return res.render("pages/admin/school-info/confirm-delete", {pageData: res.pageData});
  } catch (e: any) {
    logger.error(e);
    req.session.status = {type: "Failure", error: e, mes: "学科の情報の取得に失敗しました。"};
    res.redirect("/admin/school-info/");
  }
});

departmentRouter.post("/delete", csrfProtection, async (req: Request, res: Response) => {
  try {
    const departmentId = req.body.deleteId;

    await departmentController.deleteDepartment(departmentId);

    req.session.status = {type: "Success", mes: "学科の削除に成功しました"};
    logger.info("Department is deleted.");
  } catch (e: any) {
    logger.error(e);
    req.session.status = {type: "Failure", error: e, mes: "学科の削除に失敗しました"};
  } finally {
    res.redirect("/admin/school-info/");
  }
});

departmentRouter.get("/edit", csrfProtection, async (req: Request, res: Response) => {
  try {
    const id = req.query.id as string;
    const fetchData = (await departmentController.findById(id)).department;

    if (fetchData === null) throw new NullDataError("id does not exist in DB.");

    res.pageData.headTitle = "学科名の編集";

    res.pageData.anyData = {
      department: fetchData,
    };

    res.pageData.csrfToken = req.csrfToken();

    res.pageData.status = conversionpageStatus(req.session.status);
    req.session.status = undefined;

    req.session.keepValue = id;

    res.render("pages/admin/school-info/edit", {pageData: res.pageData});
  } catch (e: any) {
    logger.error(e);
    req.session.status = {type: "Failure", error: e, mes: "編集に必要な情報が正常に取得できませんでした。"};
    res.redirect("/admin/school-info/");
  }
});

departmentRouter.post("/update", csrfProtection, async (req: Request, res: Response) => {
  try {
    const id = req.body.id;
    const name = req.body.name;

    if (id !== req.session.keepValue) throw new InvalidDataTypeError("There is a discrepancy in the id.");

    await departmentController.update(id, name);

    req.session.status = {type: "Success", mes: "変更に成功しました"};
    logger.info("Department is updated.");
  } catch (e: any) {
    logger.error(e);
    req.session.status = {type: "Failure", error: e, mes: "変更中にエラーが発生しました。"};
  } finally {
    res.redirect("/admin/school-info");
  }
});

export default departmentRouter;
