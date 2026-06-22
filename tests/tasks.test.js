const request = require('supertest');
const app = require('../src/app');

describe('POST /api/tasks', () => {
  it('returns 400 when title is empty', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .send({ title: '', description: 'test' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Title is required');
  });
});

describe('GET /api/tasks', () => {
  it('returns an array (even when empty)', async () => {
    const response = await request(app).get('/api/tasks');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});

describe('Task integration', () => {
  it('creates a task and retrieves it by id', async () => {
    const createResponse = await request(app)
      .post('/api/tasks')
      .send({
        title: 'Integration test task',
        description: 'Created in Jest',
        status: 'todo',
      });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body._id).toBeDefined();

    const taskId = createResponse.body._id;
    const getResponse = await request(app).get(`/api/tasks/${taskId}`);

    expect(getResponse.status).toBe(200);
    expect(getResponse.body.title).toBe('Integration test task');
    expect(getResponse.body.status).toBe('todo');
  });
});
