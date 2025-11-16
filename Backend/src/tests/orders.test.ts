import mongoose from 'mongoose';
import request from 'supertest';
import app from '../app';
import Sweet from '../models/Sweet';
import { registerAndLogin } from './helpers';

jest.setTimeout(60_000);

describe('Orders API (integration)', () => {
  let agent: any;

  beforeAll(async () => {
    // rely on global setup to initialize in-memory mongo
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
    agent = request.agent(app as any);
  });

  it('places an order and returns it in history', async () => {
    // create a sweet directly
    const sweet = await Sweet.create({
      name: 'Test Ladoo',
      category: 'Indian Sweets',
      price: 50,
      imageUrl: '',
      description: 'Delicious',
      quantity: 10,
      userId: new mongoose.Types.ObjectId()
    });

    // register + login
    await registerAndLogin(agent, 'test@example.com', 'password');

    // add to cart by name
    const addRes = await agent.post('/api/auth/addcart').send({ name: 'Test Ladoo', quantity: 2 });
    expect(addRes.status).toBe(200);

    // place order
    const placeRes = await agent.post('/api/orders/place').send({});
    expect([200, 201]).toContain(placeRes.status);
    expect(placeRes.body).toHaveProperty('order');
    const order = placeRes.body.order;
    expect(order.totalAmount).toBe(100);

    // fetch orders for user
    const getRes = await agent.get('/api/orders');
    expect(getRes.status).toBe(200);
    expect(Array.isArray(getRes.body.orders)).toBe(true);
    expect(getRes.body.orders.length).toBe(1);
    expect(getRes.body.orders[0]._id).toBe(order._id);
  });
});
