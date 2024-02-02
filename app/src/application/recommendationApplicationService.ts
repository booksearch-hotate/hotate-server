import Recommendation from '../domain/model/recommendation/recommendation';
import RecommendationService from '../domain/service/recommendationService';

import RecommendationData from '../domain/model/recommendation/recommendationData';

import {IRecommendationRepository} from '../domain/model/recommendation/IRecommendationRepository';

import isSameLenAllArray from '../utils/isSameLenAllArray';
import RecommendationItem from '../domain/model/recommendation/recommendationItem';
import BookId from '../domain/model/book/bookId';
import PaginationMargin from '../domain/model/pagination/paginationMargin';
import {InfrastructureError, InvalidDataTypeError, OverflowDataError} from '../presentation/error';
import {conversionStringToDate} from '../utils/conversionDate';

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

  public async insert(title: string, content: string, thumbnailName: string) {
    const recommendation = new Recommendation(
        this.recommendationService.createUUID(),
        title,
        content,
        false,
        await this.recommendationRepository.findMaxIndex() + 1,
        thumbnailName,
        new Date(),
        new Date(),
        [],
    );

    recommendation.sanitizeContent();

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
    if (fetchModel === null) throw new InfrastructureError('レコメンデーションデータが見つかりませんでした。');

    fetchModel.sanitizeContent();

    return new RecommendationData(fetchModel);
  }

  public async update(
      id: string,
      title: string,
      content: string,
      sortIndex: number,
      thumbnailName: string,
      isSolid: boolean,
      bookIds: string[],
      bookComments: string[],
  ): Promise<void> {
    const recommendation = await this.recommendationRepository.findById(id);

    if (recommendation === null) throw new InfrastructureError('レコメンデーションデータが見つかりませんでした。');

    if (recommendation.isOverNumberOfBooks()) throw new OverflowDataError('登録できる本の個数が上限に達しています。');

    if (!isSameLenAllArray([bookIds, bookComments])) throw new InvalidDataTypeError('本の登録数とコメント数が一致しません。');

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
    recommendation.changeThumbnailName(thumbnailName);
    recommendation.sanitizeContent();

    await this.recommendationRepository.update(recommendation);
  }

  public async delete(id: string): Promise<void> {
    const recommendation = await this.recommendationRepository.findById(id);

    if (recommendation === null) throw new InfrastructureError('レコメンデーションデータが見つかりませんでした。');

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
        recommendationData.ThumbnailName,
        new Date(recommendationData.CreatedAt),
        new Date(recommendationData.UpdatedAt),
        recommendationItemModel,
    );
    return recommendationModel.isOverNumberOfBooks();
  }

  /**
   * おすすめセクションの文章を省略するための処理です
   * @param recommendations 省略したいおすすめセクションのデータ
   * @returns 文章を省略したおすすめセクション
   *
   * @deprecated 使用することでrecommendationsの作成日時及び更新日時の月が1月先に進む不具合が確認されています
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
          recommendationData.ThumbnailName,
          conversionStringToDate(recommendationData.CreatedAt),
          conversionStringToDate(recommendationData.UpdatedAt),
          recommendationItemModel,
      );
      recommendationModel.omitContent();
      return recommendationModel;
    });

    return omitRecommendations.map((recommendationModel) => new RecommendationData(recommendationModel));
  }

  /**
   * 本のIDからおすすめセクションを取得します。最大で9つのセクションを取得します。
   * @param bookId 本のID
   * @returns 本が登録されているrecommendationの配列
   */
  public async findByBookId(bookId: string): Promise<RecommendationData[] | null> {
    const bookIdModel = new BookId(bookId);
    const existRecommendationIds = await this.recommendationRepository.findByBookId(bookIdModel);

    if (existRecommendationIds.length === 0) return null;

    const fetchModels = await Promise.all(existRecommendationIds.map(async (id) => {
      const fetchData = await this.recommendationRepository.findById(id);

      if (fetchData === null) throw new InvalidDataTypeError('おすすめセクションが見つかりませんでした。');

      return fetchData;
    }));

    return fetchModels.map((model) => new RecommendationData(model));
  }

  public async removeUsingByBookId(bookId: string): Promise<void> {
    const bookIdModel = new BookId(bookId);

    await this.recommendationRepository.removeUsingByBookId(bookIdModel);
  }

  public async removeUsingAll(): Promise<void> {
    await this.recommendationRepository.removeUsingAll();
  }

  public fetchAllthumbnailName(): string[] {
    return this.recommendationRepository.fetchAllThumbnailName();
  }
}
