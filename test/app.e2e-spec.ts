import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from '../src/app.module.js';
import { ItemsStore } from '../src/items/items.store.js';
import { setupApp } from '../src/setup-app.js';

describe('API (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    setupApp(app);
    await app.init();
  });

  beforeEach(() => app.get(ItemsStore).clear());

  afterAll(async () => {
    await app.close();
  });

  const http = () => request(app.getHttpServer());

  it('GET /health', () => http().get('/health').expect(200, { status: 'ok' }));

  it('GET /config never leaks the secret', async () => {
    const res = await http().get('/config').expect(200);
    expect(res.body).toHaveProperty('app_name');
    expect(res.body).toHaveProperty('api_secret_configured');
    expect(JSON.stringify(res.body)).not.toContain(
      process.env.API_SECRET || '__no_secret__',
    );
  });

  it('CRUD flow', async () => {
    const created = await http()
      .post('/items')
      .send({ name: 'Book', price: 12.5 })
      .expect(201);
    const item = {
      id: 1,
      name: 'Book',
      description: null,
      price: 12.5,
      in_stock: true,
    };
    expect(created.body).toEqual(item);

    await http().get('/items').expect(200, [item]);
    await http().get('/items/1').expect(200, item);

    const patched = await http()
      .patch('/items/1')
      .send({ price: 10, in_stock: false })
      .expect(200);
    expect(patched.body).toMatchObject({
      name: 'Book',
      price: 10,
      in_stock: false,
    });

    await http().delete('/items/1').expect(204);
    await http().get('/items/1').expect(404);
  });

  it('returns 404 for unknown items', async () => {
    await http().get('/items/99').expect(404);
    await http().patch('/items/99').send({ price: 1 }).expect(404);
    await http().delete('/items/99').expect(404);
  });

  it('validates input', async () => {
    await http().post('/items').send({ name: '', price: 1 }).expect(400);
    await http().post('/items').send({ name: 'X', price: -1 }).expect(400);
  });

  it('serves Swagger docs', async () => {
    const res = await http().get('/docs').expect(200);
    expect(res.text).toContain('swagger-ui');
    const schema = await http().get('/openapi.json').expect(200);
    expect(schema.body.paths).toHaveProperty('/items');
  });
});
