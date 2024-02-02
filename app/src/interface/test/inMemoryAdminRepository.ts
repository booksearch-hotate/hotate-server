import {Collection, Db} from 'mongodb';
import {adminCollectionName, adminDocument} from '../../infrastructure/inMemory/collections/admin';
import {IAdminApplicationRepository} from '../../domain/model/admin/IAdminRepository';
import Admin from '../../domain/model/admin/admin';

export default class InMemoryAdminRepository implements IAdminApplicationRepository {
  private db: Db;
  private adminCollection: Collection<adminDocument>;

  constructor(db: Db) {
    this.db = db;
    this.adminCollection = db.collection<adminDocument>(adminCollectionName);
  }

  async getAdmin(): Promise<Admin> {
    const admin = await this.adminCollection.findOne({});

    if (admin === null) throw new Error('admin not found');

    return new Admin(admin.id, admin.pw);
  }

  async insertAdmin(admin: Admin): Promise<void> {
    await this.adminCollection.insertOne({id: admin.Id, pw: admin.Pw});
  }

  async updateAdmin(admin: Admin): Promise<void> {
    await this.adminCollection.updateOne({id: admin.Id}, {$set: {pw: admin.Pw}});
  }

  async findById(id: string): Promise<Admin | null> {
    const res = await this.adminCollection.findOne({id});

    return res ? new Admin(res.id, res.pw) : null;
  }
}
