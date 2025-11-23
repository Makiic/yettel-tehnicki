const request = require('supertest');
const app = require('../src/app');
const sequelize = require('../src/config/db');

let basicToken;
let adminToken;
let createdTaskId;

beforeAll(async () => {
  await sequelize.authenticate();
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('E2E: auth + tasks', () => {
  it('register basic user', async () => {
    const res = await request(app).post('/api/auth/register').send({
      firstName: 'Test',
      lastName: 'User',
      username: 'testuser',
      email: 'test@example.com',
      password: 'secret123',
      role: 'basic',
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
   
  });

  it('login basic', async () => {
    const res = await request(app).post('/api/auth/login').send({
      username: 'testuser',
      password: 'secret123',
    });
    expect(res.status).toBe(200);
    basicToken = res.body.token;
  });

  it('create own task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${basicToken}`)
      .send({ body: 'Task from test' });
    expect(res.status).toBe(201);
    createdTaskId = res.body.id;
  });

  it('list my tasks (paginated)', async () => {
    const res = await request(app)
      .get('/api/tasks/mine?page=1&limit=10&sortBy=createdAt&order=desc')
      .set('Authorization', `Bearer ${basicToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('update own task', async () => {
    const res = await request(app)
      .put(`/api/tasks/${createdTaskId}`)
      .set('Authorization', `Bearer ${basicToken}`)
      .send({ body: 'Updated by owner' });
    expect(res.status).toBe(200);
  });
});

describe('E2E: admin capabilities', () => {
  it('register and login admin', async () => {
    await request(app).post('/api/auth/register').send({
      firstName: 'Admin',
      lastName: 'User',
      username: 'admin',
      email: 'admin@example.com',
      password: 'secret123',
      role: 'admin',
    });
    const res = await request(app).post('/api/auth/login').send({
      username: 'admin',
      password: 'secret123',
    });
    expect(res.status).toBe(200);
    adminToken = res.body.token;
  });

  it('admin lists all tasks', async () => {
    const res = await request(app)
      .get('/api/tasks?page=1&limit=10&sortBy=createdAt&order=desc')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('admin updates any task', async () => {
    const res = await request(app)
      .put(`/api/tasks/${createdTaskId}/admin`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ body: 'Admin updated task' });
    expect(res.status).toBe(200);
  });

  it('admin lists users', async () => {
    const res = await request(app)
      .get('/api/users?page=1&limit=10&sortBy=createdAt&order=desc')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
  });
});