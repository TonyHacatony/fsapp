import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { initializeTestApp } from './default.e2e';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await initializeTestApp();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(200);
  });
});
