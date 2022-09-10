import Admin from '../../src/domain/model/admin/admin';
import Author from '../../src/domain/model/author/author';
import Book from '../../src/domain/model/book/book';
import Publisher from '../../src/domain/model/publisher/publisher';
import {DomainInvalidError} from '../../src/presentation/error';

const makeRandomWords = (len: number): string => {
  const S = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  return Array.from(Array(len)).map(()=>S[Math.floor(Math.random()*S.length)]).join('');
};

describe('Test validation of admin model', () => {
  test('Set invalid id', () => {
    const t = () => {
      new Admin(makeRandomWords(31), 'test');
    };
    expect(t).toThrow(DomainInvalidError);
  });

  test('Set invalid pw', () => {
    const t = () => {
      new Admin('test', makeRandomWords(61));
    };
    expect(t).toThrow(DomainInvalidError);
  });

  test('Set safety id and pw', () => {
    const t = () => {
      new Admin(makeRandomWords(30), makeRandomWords(60));
    };
    expect(t).not.toThrow(DomainInvalidError);
  });
});

describe('Test validation of author model', () => {
  test('Set invalid name', () => {
    const t = () => {
      new Author('test', makeRandomWords(201));
    };

    expect(t).toThrow(DomainInvalidError);
  });

  test('Set safety value', () => {
    const t = () => {
      new Author('test', makeRandomWords(200));
    };

    expect(t).not.toThrow(DomainInvalidError);
  });
});

describe('Test validation of book model', () => {
  const bookValidation = (name: string, subName: string | null, content: string | null) => {
    new Book('test', name, subName, content, null, null, null, new Author('author', null), new Publisher('publisher', null), []);
  };

  test('Set invalid value', () => {
    expect(() => bookValidation(makeRandomWords(151), null, null)).toThrow(DomainInvalidError);
  });

  test('Set safety value', () => {
    expect(() => bookValidation('tst', 'test', 'test')).not.toThrow(DomainInvalidError);
  });
});
