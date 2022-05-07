import axios from 'axios'

import { isLocal } from '../cli/cmdLine'
import Logger from '../Logger/logger'

import { IEsPublisher, IEsBook, IEsAuthor } from './IElasticSearchDocument'

const logger = new Logger('elasticSearch')

export default class ElasticSearch {
  private host: string
  private index: string
  private uri: string

  constructor (index: string) {
    this.host = isLocal() ? 'localhost:9200' : 'es01:9200'
    this.index = index
    this.uri = `http://${this.host}/${this.index}`
  }

  public async create (doc: IEsPublisher | IEsBook | IEsAuthor): Promise<void> {
    await axios.post(`${this.uri}/_doc/`, doc, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  public async initIndex (): Promise<void>{
    let isNone = false
    try {
      await axios.get(`${this.uri}`)
    } catch (e) {
      isNone = true
      logger.info(`${this.index}は存在しません。`)
    }
    if (!isNone) await axios.delete(`${this.uri}`)
    await axios.put(`${this.uri}`)
  }
}
