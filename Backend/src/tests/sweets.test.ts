import request from 'supertest';
import app from '../app';
import { registerAndLogin } from './helpers';

describe('Sweets', () => {
  test('list sweets (authenticated)', async () => {
    const agent = request.agent(app);
    // register + login via helper (preserve cookies)
    await registerAndLogin(agent, 's@example.com', 'password', 'S');

    const res = await agent.get('/api/sweets');
    expect([200,204]).toContain(res.status);
  });
});
