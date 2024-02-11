import Book from "../../../../domain/model/book/book";
import Recommendation from "../../../../domain/model/recommendation/recommendation";
import RecommendationData from "../../recommendation/RecommendationData";
import BookData from "../BookData";

export default class BookFetchOutputData {
  public recommendations: RecommendationData[] = [];

  public book: BookData;

  public constructor(book: Book, recommendations: Recommendation[]) {
    this.recommendations = recommendations.map((recommendation) => new RecommendationData(recommendation));

    this.book = new BookData(book);
  }
}
