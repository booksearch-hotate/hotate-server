import axios from 'axios'

import Logger from './logger'

import { IEsPublisher, IEsBook, IEsAuthor } from '../interfaces/IElasticSearchDocument'

const logger = new Logger('elasticSearch')

export default class ElasticSearch {
  private host: string
  private index: string
  private uri: string

  constructor (index: string) {
    this.host = 'es01:9200'
    this.index = index
    this.uri = `http://${this.host}/${this.index}`
  }

  public async search (searchObj: IEsAuthor | IEsPublisher | IEsBook): Promise<any> {
    const res = await axios.post(`${this.uri}/_search`, {
      query: {
        match: searchObj
      }
    }).then((res: any) => { return res.data })
    const filter = res.hits.hits.map((item: any) => {
      return {
        title: item._source.title,
        id: item._id
      }
    })
    const result = {
      total: res.hits.total.value,
      searchRes: filter
    }
    return result
  }

  public async create (doc: (IEsAuthor | IEsBook | IEsPublisher)[]): Promise<any> {
    for (const item of doc) {
      await axios.post(`${this.uri}/_doc/`, item, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }
  }
}
