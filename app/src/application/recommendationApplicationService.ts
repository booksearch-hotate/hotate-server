import RecommendationModel from '../domain/model/recommendation/recommendationModel';
import RecommendationService from '../domain/service/recommendationService';

import {IRecommendationRepository} from '../domain/model/recommendation/IRecommendationRepository';

export default class RecommendationApplicationService {
  private readonly recommendationRepository: IRecommendationRepository;
  private readonly recommendationService: RecommendationService;

  public constructor(recommendationRepository: IRecommendationRepository, recommendationService: RecommendationService) {
    this.recommendationRepository = recommendationRepository;
    this.recommendationService = recommendationService;
  }

  public async insert(title: string, content: string) {
    const recommendation = new RecommendationModel(
        this.recommendationService.createUUID(),
        title,
        content,
        false,
        await this.recommendationRepository.findMaxIndex() + 1,
        null,
        null,
        [],
    );

    await this.recommendationRepository.insert(recommendation);
  }
}
