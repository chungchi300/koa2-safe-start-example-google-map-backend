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
// describe('exception handling', () => {
//   test('exception', async () => {
//     const response = await request(app).get('/testError');
//     expect(response.status).toEqual(400);
//     expect(response.type).toEqual('application/json');
//     expect(response.body).toEqual({ _error: 'demo exception', expose: true });
//   });
// });
