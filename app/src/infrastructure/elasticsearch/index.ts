import * as appRoot from 'app-root-path';

import {isLocal} from '../cli/cmdLine';

export default class ElasticSearch {
  private host: string;
  private index: string;
  private uri: string;
  private bulkApiPath: string;

  constructor(index: string) {
    this.host = isLocal() ? 'localhost:9200' : 'es:9200';
    this.index = index;
    this.uri = `http://${this.host}/${this.index}`;

    const bulkApiFileName = `${this.index}_bulkapi.json`;
    this.bulkApiPath = `${appRoot.path}/uploads/json/${bulkApiFileName}`;
  }
}
