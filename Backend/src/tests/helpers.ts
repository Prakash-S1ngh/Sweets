import request from 'supertest';

export async function registerAndLogin(agent: any, email: string, password: string, name = 'Test User') {
  const reg = await agent.post('/api/auth/register').send({ name, email, password });
  if (![200, 201].includes(reg.status)) {
    throw new Error(`register failed: ${reg.status} ${JSON.stringify(reg.body)}`);
  }

  const login = await agent.post('/api/auth/login').send({ email, password });
  if (login.status !== 200) {
    throw new Error(`login failed: ${login.status} ${JSON.stringify(login.body)}`);
  }

  return login;
}
