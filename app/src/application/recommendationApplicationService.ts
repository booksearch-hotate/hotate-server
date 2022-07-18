import RecommendationModel from '../domain/model/recommendation/recommendationModel';
import RecommendationService from '../domain/service/recommendationService';

import RecommendationData from '../domain/model/recommendation/recommendationData';

import {IRecommendationRepository} from '../domain/model/recommendation/IRecommendationRepository';

export default class RecommendationApplicationService {
  private readonly recommendationRepository: IRecommendationRepository;
  private readonly recommendationService: RecommendationService;

  public constructor(recommendationRepository: IRecommendationRepository, recommendationService: RecommendationService) {
    this.recommendationRepository = recommendationRepository;
    this.recommendationService = recommendationService;
  }

  public async findMaxIndex(): Promise<number> {
    return await this.recommendationRepository.findMaxIndex();
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

  public async fetch(pageCount: number): Promise<RecommendationData[]> {
    const fetchModels = await this.recommendationRepository.fetch(pageCount);
    return fetchModels.map((recommendation) => new RecommendationData(recommendation));
  }

  public async fetchAllCount(): Promise<number> {
    return this.recommendationRepository.fetchAllCount();
  }

  public async findById(id: string): Promise<RecommendationData> {
    const fetchModel = await this.recommendationRepository.findById(id);
    if (fetchModel === null) throw new Error('Cannot find recommendation section.');
    return new RecommendationData(fetchModel);
  }
}
