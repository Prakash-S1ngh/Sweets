import request from 'supertest';
import app from '../src/app.ts';

describe('Sweets', () => {
  test('list sweets', async () => {
    const res = await request(app).get('/api/sweets');
    expect(res.status).toBe(200);
  });
});
