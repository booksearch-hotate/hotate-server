import {MongoClient} from 'mongodb';
import {MongoMemoryServer} from 'mongodb-memory-server';
import Logger from '../logger/logger';

const logger = new Logger('InMemory');

export default class InMemoryDb {
  con: MongoClient | null = null;
  mongoServer: MongoMemoryServer | null = null;

  /**
   * mongoDBの初期化を行います
   */
  async init() {
    this.mongoServer = await MongoMemoryServer.create();
    this.con = await MongoClient.connect(this.mongoServer.getUri(), {});
  }

  async remove() {
    if (this.con) await this.con.close();

    if (this.mongoServer) await this.mongoServer.stop();
  }

  db() {
    if (this.con === null || this.mongoServer === null) {
      logger.error('Value of connection or mongo is null. Please execute init method.');
      throw new Error('Miss connect DB');
    }

    const db = this.con.db(this.mongoServer.instanceInfo!.dbName);

    return db;
  }
}
