const request = require('supertest');
const { app } = require('../server');
const Event = require('../models/Event');
const { createTestFiles, cleanupTestFiles } = require('./helpers/fileHelper');

describe('Event API Tests', () => {
  let testFiles;
  let createdEventId;

  beforeAll(() => {
    testFiles = createTestFiles();
  });

  afterAll(() => {
    cleanupTestFiles();
  });

  beforeEach(async () => {
    await Event.deleteMany({});
  });

  // 测试创建事件
  describe('POST /api/events', () => {
    it('should create a new event with files', async () => {
      const eventData = {
        title: '测试活动',
        time: {
          start: new Date('2025-03-01T10:00:00Z'),
          end: new Date('2025-03-01T12:00:00Z')
        },
        description: {
          content: '这是一个测试活动的描述',
          format: 'plain'
        },
        links: [{
          type: '注册',
          description: '活动注册链接',
          url: 'https://example.com/register'
        }],
        tags: ['测试', '活动']
      };

      const response = await request(app)
        .post('/api/events')
        .field('data', JSON.stringify(eventData))
        .attach('video', testFiles.videoFile)
        .attach('images', testFiles.imageFile)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(eventData.title);
      expect(response.body.data.video).toBeDefined();
      expect(response.body.data.images).toHaveLength(1);

      createdEventId = response.body.data._id;
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/events')
        .field('data', JSON.stringify({ title: '测试活动' }))
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
  });

  // 测试获取事件列表
  describe('GET /api/events', () => {
    beforeEach(async () => {
      // 创建测试数据
      await Event.create([
        {
          title: '活动 1',
          time: {
            start: new Date('2025-03-01T10:00:00Z'),
            end: new Date('2025-03-01T12:00:00Z')
          },
          description: { content: '描述 1', format: 'plain' },
          tags: ['标签1', '标签2']
        },
        {
          title: '活动 2',
          time: {
            start: new Date('2025-03-02T10:00:00Z'),
            end: new Date('2025-03-02T12:00:00Z')
          },
          description: { content: '描述 2', format: 'plain' },
          tags: ['标签2', '标签3']
        }
      ]);
    });

    it('should get all events when no filter', async () => {
      const response = await request(app)
        .get('/api/events')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
    });

    it('should filter events by tags', async () => {
      const response = await request(app)
        .get('/api/events')
        .query({ tags: '标签1' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].tags).toContain('标签1');
    });
  });

  // 测试获取单个事件
  describe('GET /api/events/:id', () => {
    let testEventId;

    beforeEach(async () => {
      const event = await Event.create({
        title: '测试活动',
        time: {
          start: new Date('2025-03-01T10:00:00Z'),
          end: new Date('2025-03-01T12:00:00Z')
        },
        description: { content: '描述', format: 'plain' }
      });
      testEventId = event._id;
    });

    it('should get an event by id', async () => {
      const response = await request(app)
        .get(`/api/events/${testEventId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(testEventId.toString());
    });

    it('should return 404 for non-existent event', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .get(`/api/events/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Event not found');
    });
  });

  // 测试更新事件
  describe('PUT /api/events/:id', () => {
    let testEventId;

    beforeEach(async () => {
      const event = await Event.create({
        title: '原始活动',
        time: {
          start: new Date('2025-03-01T10:00:00Z'),
          end: new Date('2025-03-01T12:00:00Z')
        },
        description: { content: '原始描述', format: 'plain' }
      });
      testEventId = event._id;
    });

    it('should update an event with new files', async () => {
      const updateData = {
        title: '更新后的活动',
        time: {
          start: new Date('2025-03-02T10:00:00Z'),
          end: new Date('2025-03-02T12:00:00Z')
        },
        description: { content: '更新后的描述', format: 'plain' }
      };

      const response = await request(app)
        .put(`/api/events/${testEventId}`)
        .field('data', JSON.stringify(updateData))
        .attach('video', testFiles.videoFile)
        .attach('images', testFiles.imageFile)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(updateData.title);
      expect(response.body.data.video).toBeDefined();
      expect(response.body.data.images).toHaveLength(1);
    });
  });

  // 测试删除事件
  describe('DELETE /api/events/:id', () => {
    let testEventId;

    beforeEach(async () => {
      const event = await Event.create({
        title: '待删除活动',
        time: {
          start: new Date('2025-03-01T10:00:00Z'),
          end: new Date('2025-03-01T12:00:00Z')
        },
        description: { content: '描述', format: 'plain' }
      });
      testEventId = event._id;
    });

    it('should delete an event', async () => {
      const response = await request(app)
        .delete(`/api/events/${testEventId}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // 验证事件已被删除
      const deletedEvent = await Event.findById(testEventId);
      expect(deletedEvent).toBeNull();
    });
  });
});