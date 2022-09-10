import supertest from 'supertest';
import {app} from '../../src/handler/app';

const request = supertest(app);

const fetchCsrfData = async (inputPath: string): Promise<{token: string, cookie: string}> => {
  const loginPage = await request.get(inputPath);

  const dom = loginPage.text;

  const csrtTokenMetaTag = '<meta name="csrfToken" content="';

  const startIndex = dom.indexOf(csrtTokenMetaTag) + csrtTokenMetaTag.length;

  const endIndex = dom.substring(startIndex).indexOf('">') + startIndex;

  return {
    token: dom.substring(startIndex, endIndex),
    cookie: loginPage.headers['set-cookie'],
  };
};

describe('Test the root path', () => {
  test('It should response the GET method', async () => {
    const res = await request.get('/');
    expect(res.statusCode).toBe(200);
  });
});

describe('Test admin page', () => {
  test('Access directly', async () => {
    const res = await request.get('/admin/');
    expect(res.headers['location']).toEqual('/login');
  });

  test('Access with credentials', async () => {
    const csrfTokenData = await fetchCsrfData('/login');

    const userData = {
      id: 'akamurasaki',
      pw: 'aiueo',
      _csrf: csrfTokenData.token,
    };

    const res = await request
        .post('/check')
        .type('form')
        .set('Cookie', csrfTokenData.cookie)
        .send(userData);

    expect(res.headers['location']).toEqual('admin');
  });
});
