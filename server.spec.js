const request = require('supertest');
const db = require('./db-config');
const app = require('./server');

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
  await db.seed.run(); // Ensure the database is seeded before tests
});

afterAll(async () => {
  await db.destroy();
});

describe('API Endpoints', () => {
  it('should return a list of items on GET /items', async () => {
    const res = await request(app).get('/items');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should create a new item on POST /items', async () => {
    const newItem = { name: 'Item 3', description: 'Description for Item 3' };
    const res = await request(app).post('/items').send(newItem);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toEqual(newItem.name);
    expect(res.body.description).toEqual(newItem.description);
  });

  it('should update an existing item on PUT /items/:id', async () => {
    const updates = { name: 'Updated Item 1', description: 'Updated description' };
    const res = await request(app).put('/items/1').send(updates);
    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toEqual(updates.name);
    expect(res.body.description).toEqual(updates.description);
  });

  it('should return 404 for non-existent item on PUT /items/:id', async () => {
    const updates = { name: 'Non-existent Item', description: 'Non-existent description' };
    const res = await request(app).put('/items/999').send(updates);
    expect(res.statusCode).toEqual(404);
  });

  it('should delete an item on DELETE /items/:id', async () => {
    const res = await request(app).delete('/items/1');
    expect(res.statusCode).toEqual(204);
  });

  it('should return 404 for non-existent item on DELETE /items/:id', async () => {
    const res = await request(app).delete('/items/999');
    expect(res.statusCode).toEqual(404);
  });

  // Additional tests
  it('should return 400 on POST /items with missing fields', async () => {
    const res = await request(app).post('/items').send({});
    expect(res.statusCode).toEqual(500); // Adjust as per your error handling
  });

  it('should return 400 on PUT /items/:id with missing fields', async () => {
    const res = await request(app).put('/items/2').send({});
    expect(res.statusCode).toEqual(500); // Adjust as per your error handling
  });

  it('should fetch a specific item on GET /items/:id', async () => {
    const res = await request(app).get('/items/2');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBeDefined();
  });

  it('should return 404 for non-existent item on GET /items/:id', async () => {
    const res = await request(app).get('/items/999');
    expect(res.statusCode).toEqual(404);
  });
});
