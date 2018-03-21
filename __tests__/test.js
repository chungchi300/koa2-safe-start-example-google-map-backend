const request = require('supertest');
const fs = require('fs');
const path = require('path');

const app = require('../src/app.js');

afterEach(() => {
  app.close();
});
beforeEach(() => {
  originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 60 * 1000;
  return global.sequelize.sync({ force: true });
});
function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

describe('route', () => {
  test('create route', async () => {
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
  test('get route in progress', async () => {
    const createTokenResponse = await request(app)
      .post('/route')
      .type('json')
      .send([
        ['22.372081', '114.107877'],
        ['22.284419', '114.159510'],
        ['22.326442', '114.167811'],
      ]);

    const response = await request(app).get(
      `/route/${createTokenResponse.body.token}`
    );

    expect(response.status).toEqual(200);
    expect(response.type).toEqual('application/json');
    expect(response.body.status).toEqual('in progress');
  });
  test('get route succeed', async () => {
    const createTokenResponse = await request(app)
      .post('/route')
      .type('json')
      .send([
        ['22.372081', '114.107877'],
        ['22.284419', '114.159510'],
        ['22.326442', '114.167811'],
      ]);
    await sleep(5000);
    const response = await request(app).get(
      `/route/${createTokenResponse.body.token}`
    );
    expect(response.status).toEqual(200);
    expect(response.type).toEqual('application/json');
    // console.log('body', response.body);
    expect(response.body.status).toEqual('success');
    //Optimized path
    expect(response.body.path).toEqual([
      ['22.372081', '114.107877'],
      ['22.326442', '114.167811'],
      ['22.284419', '114.159510'],
    ]);
  });
  test('get route fail', async () => {
    const createTokenResponse = await request(app)
      .post('/route')
      .type('json')
      .send([
        ['12.372081', '114.107877'],
        ['52.284419', '114.159510'],
        ['42.326442', '114.167811'],
      ]);
    await sleep(5000);
    const response = await request(app).get(
      `/route/${createTokenResponse.body.token}`
    );
    expect(response.status).toEqual(200);
    expect(response.type).toEqual('application/json');
    expect(response.body.status).toEqual('failure');
  });
});
