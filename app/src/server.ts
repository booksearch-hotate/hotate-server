import {startAppServer} from './handler/app';
import {startWSServer} from './handler/ws';

const appPort = 8080;
const wsPort = 5051;
startAppServer(appPort);
startWSServer(wsPort);
