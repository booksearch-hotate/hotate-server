import Recommendation from '../domain/model/recommendation/recommendation';
import RecommendationService from '../domain/service/recommendationService';

import RecommendationData from '../domain/model/recommendation/recommendationData';

import {IRecommendationRepository} from '../domain/model/recommendation/IRecommendationRepository';

import isSameLenAllArray from '../utils/isSameLenAllArray';
import RecommendationItem from '../domain/model/recommendation/recommendationItem';
import BookId from '../domain/model/book/bookId';
import PaginationMargin from '../domain/model/pagination/paginationMargin';

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
    const recommendation = new Recommendation(
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
    const fetchModels = await this.recommendationRepository.fetch(pageCount, new PaginationMargin(count));
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

    const items: RecommendationItem[] = [];

    if (!(bookIds instanceof Array)) return;

    for (let i = 0; i < bookIds.length; i++) {
      items.push(new RecommendationItem(new BookId(bookIds[i]), bookComments[i]));
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
    const recommendationItemModel = recommendationData.RecommendationItems.map((item) => new RecommendationItem(new BookId(item.BookId), item.Comment));

    /* ダミーデータの追加 */
    recommendationItemModel.push(new RecommendationItem(new BookId('dummy'), ''));
    const recommendationModel = new Recommendation(
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

  /**
   * おすすめセクションの文章を省略するための処理です
   * @param recommendations 省略したいおすすめセクションのデータ
   * @returns 文章を省略したおすすめセクション
   */
  public omitContent(recommendations: RecommendationData[]): RecommendationData[] {
    const omitRecommendations = recommendations.map((recommendationData) => {
      const recommendationItemModel = recommendationData.RecommendationItems.map((item) => new RecommendationItem(new BookId(item.BookId), item.Comment));

      const recommendationModel = new Recommendation(
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

  /**
   * 本のIDからおすすめセクションを取得します。複数のセクションが存在する場合は、直近に登録されたセクションを適用します。
   * @param bookId 本のID
   * @returns 本が登録されているおすすめ機能
   */
  public async findRecommendationByBookId(bookId: string): Promise<RecommendationData | null> {
    const bookIdModel = new BookId(bookId);
    const existRecommendationId = await this.recommendationRepository.findByBookId(bookIdModel);

    if (existRecommendationId === null) return null;

    const fetchModel = await this.recommendationRepository.findById(existRecommendationId);

    return fetchModel === null ? null : new RecommendationData(fetchModel);
  }
}
