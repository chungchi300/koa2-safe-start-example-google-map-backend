const request = require('supertest');
const fs = require('fs');
const path = require('path');

const app = require('../src/app.js');

afterEach(() => {
  app.close();
});
beforeEach(() => {
  return global.sequelize.sync({ force: true });
});
//
describe('index', () => {
  test('should respond success message', async () => {
    const response = await request(app).get('/');
    expect(response.status).toEqual(200);
    expect(response.type).toEqual('application/json');
    expect(response.body).toEqual({
      app: 'koa2-safe-start',
      author: 'Jeff Chung',
      message: 'Welcome my friend',
    });
  });
});
describe('route', () => {
  test.only('create route', async () => {
    const response = await request(app)
      .post('/route')
      .type('json')
      .send([
        ['22.372081', '114.107877'],
        ['22.284419', '114.159510'],
        ['22.326442', '114.167811'],
      ]);

    expect(response.status).toEqual(200);
    expect(response.type).toEqual('application/json');
    expect(response.body.token.length > 0).toBe(true);
  });
  test('create fail due to data validation -  every location must be array ', async () => {
    const response = await request(app)
      .post('/route')
      .type('json')
      .send([['12.1', '12.2'], 'a', '123']);

    expect(response.status).toEqual(400);
    expect(response.type).toEqual('application/json');
    expect(response.body.error.length > 0).toEqual(true);
  });
  test('create fail due to data validation - locations must be array', async () => {
    const response = await request(app)
      .post('/route')
      .type('json')
      .send({ name: 'abc' });

    expect(response.status).toEqual(400);
    expect(response.type).toEqual('application/json');
    expect(response.body.error.length > 0).toEqual(true);
  });

  test('create fail due to data validation - every location must be numeric array ', async () => {
    const response = await request(app)
      .post('/route')
      .type('json')
      .send([['a', '11.2'], ['12.1', '12.2']]);

    expect(response.status).toEqual(400);
    expect(response.type).toEqual('application/json');

    expect(response.body.error.length > 0).toEqual(true);
  });
});
describe('test google map', () => {});
// describe('exception handling', () => {
//   test('exception', async () => {
//     const response = await request(app).get('/testError');
//     expect(response.status).toEqual(400);
//     expect(response.type).toEqual('application/json');
//     expect(response.body).toEqual({ _error: 'demo exception', expose: true });
//   });
// });
