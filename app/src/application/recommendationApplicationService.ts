import RecommendationModel from '../domain/model/recommendation/recommendationModel';
import RecommendationService from '../domain/service/recommendationService';

import RecommendationData from '../domain/model/recommendation/recommendationData';

import {IRecommendationRepository} from '../domain/model/recommendation/IRecommendationRepository';

import isSameLenAllArray from '../utils/isSameLenAllArray';
import RecommendationItemModel from '../domain/model/recommendation/recommendationItemModel';
import BookIdModel from '../domain/model/book/bookIdModel';
import PaginationMarginModel from '../domain/model/pagination/paginationMarginModel';

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

  public async fetch(pageCount: number, count: number): Promise<RecommendationData[]> {
    const fetchModels = await this.recommendationRepository.fetch(pageCount, new PaginationMarginModel(count));
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

  public async update(
      id: string,
      title: string,
      content: string,
      sortIndex: number,
      isSolid: boolean,
      bookIds: string[],
      bookComments: string[],
  ): Promise<void> {
    const recommendation = await this.recommendationRepository.findById(id);

    if (recommendation === null) throw new Error('Cannot find recommendation section.');

    if (recommendation.isOverNumberOfBooks()) throw new Error('The number of books has been exceeded.');

    if (!isSameLenAllArray([bookIds, bookComments])) throw new Error('Invalid recommendation data.');

    const items: RecommendationItemModel[] = [];

    if (!(bookIds instanceof Array)) return;

    for (let i = 0; i < bookIds.length; i++) {
      items.push(new RecommendationItemModel(new BookIdModel(bookIds[i]), bookComments[i]));
    }

    recommendation.changeTitle(title);
    recommendation.changeContent(content);
    recommendation.changeSortIndex(sortIndex);
    recommendation.changeIsSolid(isSolid);
    recommendation.replaceItems(items);

    await this.recommendationRepository.update(recommendation);
  }

  public async delete(id: string): Promise<void> {
    const recommendation = await this.recommendationRepository.findById(id);

    if (recommendation === null) throw new Error('Cannot find recommendation section.');

    await this.recommendationRepository.delete(recommendation);
  }

  public isOverNumberOfBooksWhenAdd(recommendationData: RecommendationData): boolean {
    const recommendationItemModel = recommendationData.RecommendationItems.map((item) => new RecommendationItemModel(new BookIdModel(item.BookId), item.Comment));

    /* ダミーデータの追加 */
    recommendationItemModel.push(new RecommendationItemModel(new BookIdModel('dummy'), ''));
    const recommendationModel = new RecommendationModel(
        recommendationData.Id,
        recommendationData.Title,
        recommendationData.Content,
        recommendationData.IsSolid,
        recommendationData.SortIndex,
        recommendationData.CreatedAt,
        recommendationData.UpdatedAt,
        recommendationItemModel,
    );
    return recommendationModel.isOverNumberOfBooks();
  }

  public omitContent(recommendations: RecommendationData[]): RecommendationData[] {
    const omitRecommendations = recommendations.map((recommendationData) => {
      const recommendationItemModel = recommendationData.RecommendationItems.map((item) => new RecommendationItemModel(new BookIdModel(item.BookId), item.Comment));

      const recommendationModel = new RecommendationModel(
          recommendationData.Id,
          recommendationData.Title,
          recommendationData.Content,
          recommendationData.IsSolid,
          recommendationData.SortIndex,
          recommendationData.CreatedAt,
          recommendationData.UpdatedAt,
          recommendationItemModel,
      );
      recommendationModel.omitContent();
      return recommendationModel;
    });

    return omitRecommendations.map((recommendationModel) => new RecommendationData(recommendationModel));
  }
}
