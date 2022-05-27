import EsSearchHistory from '../../infrastructure/elasticsearch/esSearchHistory';
import SearchHistoryModel from '../../domain/model/searchHistoryModel';

import {ISearchHistoryApplicationRepository} from '../../application/repository/ISearchHistoryApplicationRepository';

export default class SearchHistoryRepository implements ISearchHistoryApplicationRepository {
  private readonly esSearchHistory: EsSearchHistory;

  public constructor(searchHistoryModel: EsSearchHistory) {
    this.esSearchHistory = searchHistoryModel;
  }

  public async add(tar: SearchHistoryModel) {
    this.esSearchHistory.add(tar.Words);
  }
}
