import {startAppServer} from './handler/app';
import {startWSServer} from './handler/ws';
import dotenv from 'dotenv';
import db from './infrastructure/prisma/prisma';

dotenv.config();

try {
  const appPort = Number(process.env.APP_PORT);
  const wsPort = Number(process.env.WS_PORT);

  startAppServer(appPort);
  startWSServer(wsPort);
} catch (e) {
  console.error(e);
} finally {
  db.$disconnect();
}
