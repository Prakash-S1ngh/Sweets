import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app';
import User from '../models/User';
import Sweet from '../models/Sweet';

describe('Order flow (TDD)', () => {
  let agent: any;

  beforeAll(async () => {
    agent = request.agent(app);
  });

  test('place order creates an Order and clears the Cart', async () => {
    // Temporary failing assertion to demonstrate Red step
    expect(false).toBe(true);
    // register
    const userRes = await agent.post('/api/auth/register').send({
      name: 'TDD User',
      email: 'tdd@example.com',
      password: 'password123'
    });
    expect(userRes.status).toBe(201);

    // login to set cookie
    const loginRes = await agent.post('/api/auth/login').send({
      email: 'tdd@example.com',
      password: 'password123'
    });
    expect(loginRes.status).toBe(200);

    // create a sweet (admin-like action) directly via model to avoid auth complexity
    const user = await User.findOne({ email: 'tdd@example.com' });
    const sweet = await Sweet.create({
      name: 'Test Sweet',
      description: 'yummy',
      price: 50,
      quantity: 10,
      category: 'candies',
      userId: user?._id
    });

    // add to cart (authenticated user)
    const addCartRes = await agent.post('/api/auth/addcart').send({
      name: 'Test Sweet',
      quantity: 2
    });
    expect(addCartRes.status).toBe(200);

    // place order
    const placeRes = await agent.post('/api/orders/place').send({
      paymentMethod: 'cod'
    });
    // Expect 201 created (or 200 depending on implementation)
    expect([200,201]).toContain(placeRes.status);
    expect(placeRes.body).toBeDefined();
    expect(placeRes.body.order).toBeDefined();
    expect(placeRes.body.order.items).toBeInstanceOf(Array);
    expect(placeRes.body.order.items.length).toBeGreaterThan(0);

    // ensure cart is cleared
    const cartRes = await agent.get('/api/auth/getcart');
    expect(cartRes.status).toBe(200);
    expect(cartRes.body.cart).toBeDefined();
    expect(cartRes.body.cart.items == null || cartRes.body.cart.items.length === 0).toBeTruthy();
  });
});
