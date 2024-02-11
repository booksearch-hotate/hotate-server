import BookId from "../../domain/model/book/bookId";
import RecommendationId from "../../domain/model/recommendation/recommendationId";
import RecommendationItem from "../../domain/model/recommendation/recommendationItem";
import {IBookDBRepository} from "../../domain/repository/db/IBookDBRepository";
import {IRecommendationDBRepository} from "../../domain/repository/db/IRecommendationDBRepository";
import RecommendationUpdateInputData from "../../presentation/dto/recommendation/update/RecommendationUpdateInputData";
import {Usecase} from "../Usecase";

export default class UpdateRecommendationUseCase implements Usecase<RecommendationUpdateInputData, Promise<void>> {
  private recommendationDB: IRecommendationDBRepository;
  private readonly bookDB: IBookDBRepository;

  public constructor(recommendationDB: IRecommendationDBRepository, bookDB: IBookDBRepository) {
    this.recommendationDB = recommendationDB;
    this.bookDB = bookDB;
  }

  public async execute(input: RecommendationUpdateInputData): Promise<void> {
    const recommendation = await this.recommendationDB.findById(new RecommendationId(input.id));

    if (recommendation === null) throw new Error("おすすめ情報が見つかりませんでした。");

    const recommendationCount = await this.recommendationDB.count();

    const sortIndex = recommendationCount - (input.formSortIndex - 1);

    recommendation.changeTitle(input.title);
    recommendation.changeContent(input.content);
    recommendation.changeIsSolid(input.isSolid);
    recommendation.changeThumbnailName(input.thumbnailName);
    recommendation.changeSortIndex(sortIndex);
    recommendation.changeItems(await Promise.all(input.recommendationItems.map(async (item) => {
      const book = await this.bookDB.findById(new BookId(item.bookId));
      if (book === null) throw new Error("おすすめ機能に紐づく書籍が見つかりませんでした。");
      return new RecommendationItem(book.book, item.comment);
    })));

    await this.recommendationDB.update(recommendation);
  }
}
