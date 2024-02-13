export interface IBookImgRepository {
  fetchBookImg(isbn: string): Promise<string | null>;
}
