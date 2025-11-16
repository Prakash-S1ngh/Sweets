import request from 'supertest';
import app from '../app';
import mongoose from 'mongoose';

describe('Auth', () => {
  beforeAll(async () => {
    // connect to in-memory or real test db in CI
  });
  afterAll(async () => {
    await mongoose.disconnect();
  });

  test('register missing fields', async () => {
    const res = await request(app).post('/api/auth/register').send({});
    expect(res.status).toBe(400);
  });
});
