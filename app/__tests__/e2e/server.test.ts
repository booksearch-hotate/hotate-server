import supertest from 'supertest';
import {app} from '../../src/handler/app';

const request = supertest(app);

describe('Test the root path', () => {
  test('It should response the GET method', async () => {
    const res = await request.get('/');
    expect(res.statusCode).toBe(200);
  });
});
