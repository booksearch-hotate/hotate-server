import {IBookRepository} from '../domain/model/book/IBookRepository';
import BookData from '../domain/model/book/bookData';
import BookId from '../domain/model/book/bookId';
import {IBookmarkRepository} from '../domain/model/bookmark/IBookmarkRepository';
import {IUserRepository} from '../domain/model/user/IUserRepository';
import Logger from '../infrastructure/logger/logger';

const logger = new Logger('bookmarkApplicationService');

export default class BookmarkApplicationService {
  private readonly bookmarkRepository: IBookmarkRepository;
  private readonly bookRepository: IBookRepository;
  private readonly userRepository: IUserRepository;

  public constructor(bookmarkRepository: IBookmarkRepository, bookRepository: IBookRepository, userRepository: IUserRepository) {
    this.bookmarkRepository = bookmarkRepository;
    this.bookRepository = bookRepository;
    this.userRepository = userRepository;
  }

  public async insert(userId: number, bookId: string): Promise<void> {
    try {
      const book = await this.bookRepository.searchById(new BookId(bookId));
      const user = await this.userRepository.findById(userId);

      if (!book || !user) throw new Error('Book or user not found');

      this.bookmarkRepository.save(user, book);
    } catch (error: any) {
      logger.error(error.message);
      throw new Error('Failed to add bookmark');
    }
  }

  public async isAlreadyBookmarked(userId: number, bookId: string): Promise<boolean> {
    try {
      const book = await this.bookRepository.searchById(new BookId(bookId));
      const user = await this.userRepository.findById(userId);

      if (!book || !user) throw new Error('Book or user not found');

      return await this.bookmarkRepository.isAlreadyBookmarked(user, book);
    } catch (error: any) {
      logger.error(error.message);
      throw new Error('Failed to check if already bookmarked');
    }
  }

  public async getBookmarksByUserId(userId: number): Promise<BookData[]> {
    try {
      const user = await this.userRepository.findById(userId);

      if (!user) throw new Error('User not found');

      const books = await this.bookmarkRepository.getBookmarksByUserId(userId);

      const SLICE_STR_LENGTH = 50;

      return books.map((book) => {
        if (book.Content !== null && book.Content.length > SLICE_STR_LENGTH) {
          book.changeContent(`${book.Content.substring(0, SLICE_STR_LENGTH)}...`);
        }
        return new BookData(book);
      });
    } catch (error: any) {
      logger.error(error.message);
      throw new Error('Failed to get bookmarks');
    }
  }

  public async remove(userId: number, bookId: string): Promise<void> {
    try {
      const book = await this.bookRepository.searchById(new BookId(bookId));

      const user = await this.userRepository.findById(userId);

      if (!book || !user) throw new Error('Book or user not found');

      await this.bookmarkRepository.delete(user, book);
    } catch (error: any) {
      logger.error(error.message);
      throw new Error('Failed to remove bookmark');
    }
  }
}
