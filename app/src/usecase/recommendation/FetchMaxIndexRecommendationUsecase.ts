import "reflect-metadata";

import {IRecommendationDBRepository} from "../../domain/repository/db/IRecommendationDBRepository";
import RecommendationFetchMaxIndexOutputData from "../../presentation/dto/recommendation/fetchMaxIndex/RecommendationFetchMaxIndexOutputData";
import {Usecase} from "../Usecase";

export default class FetchMaxIndexRecommendationUseCase implements Usecase<void, Promise<RecommendationFetchMaxIndexOutputData>> {
  private recommendationDB: IRecommendationDBRepository;

  public constructor(recommendationDB: IRecommendationDBRepository) {
    this.recommendationDB = recommendationDB;
  }

  public async execute(input: void): Promise<RecommendationFetchMaxIndexOutputData> {
    const maxIndex = await this.recommendationDB.fetchMaxIndex();
    return new RecommendationFetchMaxIndexOutputData(maxIndex);
  }
}
