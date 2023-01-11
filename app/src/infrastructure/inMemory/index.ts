import {MongoClient} from 'mongodb';
import {MongoMemoryServer} from 'mongodb-memory-server';
import {InMemoryDBError} from '../../presentation/error/infrastructure/inMemoryDBError';

/**
 * インメモリで動作するDBです。このDBは**開発環境でのみ動作します**。
 *
 * MongoDB : https://www.mongodb.com/
 *
 * MongoMemoryServer: https://github.com/nodkz/mongodb-memory-server
 *
 * また、起動する際は必ず`.init()`を呼び出してください。
 */
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
      throw new InMemoryDBError('Value of connection or mongo is null. Please execute init method.');
    }

    const db = this.con.db(this.mongoServer.instanceInfo!.dbName);

    return db;
  }
}
