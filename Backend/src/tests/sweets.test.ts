import request from 'supertest';
import app from '../app.js';

describe('Sweets', () => {
  test('list sweets', async () => {
    const res = await request(app).get('/api/sweets');
    expect(res.status).toBe(200);
  });
});
