import {Db} from 'mongodb';
import Department from '../../domain/model/department/department';
import {IDepartmentRepository} from '../../domain/model/department/IDepartmentRepository';
import {departmentCollectionName, departmentDocument} from '../../infrastructure/inMemory/collections/department';

export default class TestDepartmentRepository implements IDepartmentRepository {
  db: Db;
  col;

  constructor(db: Db) {
    this.db = db;
    this.col = db.collection<departmentDocument>(departmentCollectionName);
  }

  async findAllDepartment(): Promise<Department[]> {
    const data = this.col.find();

    const list:Department[] = [];

    await data.forEach((data) => {
      const res = new Department(
          data.id,
          data.name,
      );

      list.push(res);
    });

    return list;
  }

  async insertDepartment(department: Department): Promise<void> {
    const insertDoc: departmentDocument = {name: department.Name, id: department.Id};

    await this.col.insertOne(insertDoc);
  }

  async findById(id: string): Promise<Department | null> {
    const data = await this.col.findOne({id});

    if (data === null) return null;

    const res = new Department(
        data.id,
        data.name,
    );

    return res;
  }

  async findByName(name: string | null): Promise<Department | null> {
    const data = await this.col.findOne({name: name === null ? '' : name});

    if (data === null) return null;

    const res = new Department(
        data.id,
        data.name,
    );

    return res;
  }

  async update(department: Department): Promise<void> {
    const updateDoc: departmentDocument = {name: department.Name, id: department.Id};

    await this.col.updateOne({id: department.Id}, updateDoc);
  }

  async deleteDepartment(id: string): Promise<void> {
    await this.col.deleteOne({id});
  }

  async count(): Promise<number> {
    return await this.col.countDocuments();
  }
}
