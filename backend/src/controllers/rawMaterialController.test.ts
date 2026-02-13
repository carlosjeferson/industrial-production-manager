import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import { prisma } from '../database/prisma.js';

describe('Raw Material API Integration', () => {
  beforeEach(async () => {
    await prisma.productRawMaterial.deleteMany();
    await prisma.rawMaterial.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should be able to create a new raw material', async () => {
    const response = await request(app)
      .post('/raw-materials')
      .send({
        code: 'TEST-001',
        name: 'Test Material',
        stockQuantity: 100
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.code).toBe('TEST-001');
  });

  it('should return 400 if code already exists', async () => {
    await request(app).post('/raw-materials').send({
      code: 'DUP-01', name: 'Mat 1', stockQuantity: 10
    });

    const response = await request(app).post('/raw-materials').send({
      code: 'DUP-01', name: 'Mat 2', stockQuantity: 20
    });

    expect(response.status).toBe(400);
  });
});