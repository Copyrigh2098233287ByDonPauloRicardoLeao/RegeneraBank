/*
|---------------------------------------------------------------------------------------|
|  --> REGENERA ENTERPRISE SYSTEM v4.0                                                  |
|---------------------------------------------------------------------------------------|

PROJECT:       Regenera Bank
CEO:           Raphaela Cerveski
DEVELOPER:     Don Paulo Ricardo
ID:            2098233287
COPYRIGHT:     Copyright (c) 2026 Regenera Corporate

LICENSE:       EULA (End-User License Agreement)
PROTECTION:    PROPRIEDADE INTELECTUAL RESTRITA

WARNING:       TODOS OS DIREITOS RESERVADOS. Proibida a cópia, distribuição,
               engenharia reversa ou modificação não autorizada.

|---------------------------------------------------------------------------------------|
|  --> CLASSIFICATION: PROPRIETARY // DEVELOPER MAINTAINED // REQUIRES SENIOR REVIEW          |
|---------------------------------------------------------------------------------------|
*/

import { Injectable, ConflictException, Logger } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class IdempotencyService {
  private redis!: Redis;
  private readonly logger = new Logger(IdempotencyService.name);
  private memoryCache = new Map<string, string>();
  private useMemory = false;

  constructor() {
    try {
      this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
        maxRetriesPerRequest: 1,
        connectTimeout: 2000,
      });
      this.redis.on('error', (err) => {
        this.logger.warn(`Redis connection error, falling back to memory: ${err.message}`);
        this.useMemory = true;
      });
    } catch (e) {
      this.logger.warn('Failed to initialize Redis, using in-memory cache');
      this.useMemory = true;
    }
  }

  async acquireLock(key: string, userId: string): Promise<void> {
    const lockKey = `idempotency:${userId}:${key}`;
    if (this.useMemory) {
      if (this.memoryCache.has(lockKey)) {
        throw new ConflictException('Transação já processada ou em andamento.');
      }
      this.memoryCache.set(lockKey, 'LOCKED');
      return;
    }

    try {
      // SET NX EX 86400 (24h)
      const result = await this.redis.set(lockKey, 'LOCKED', 'EX', 86400, 'NX');
      if (!result) {
        this.logger.warn(`Idempotency lock failed for key: ${key} user: ${userId}`);
        throw new ConflictException('Transação já processada ou em andamento.');
      }
    } catch (e) {
      if (e instanceof ConflictException) throw e;
      this.logger.warn(`Redis failed to set lock, falling back to memory: ${e}`);
      this.useMemory = true;
      if (this.memoryCache.has(lockKey)) {
        throw new ConflictException('Transação já processada ou em andamento.');
      }
      this.memoryCache.set(lockKey, 'LOCKED');
    }
  }

  async get(key: string, userId: string): Promise<any | null> {
    const logKey = `idempotency_result:${userId}:${key}`;
    if (this.useMemory) {
      const cached = this.memoryCache.get(logKey);
      return cached ? JSON.parse(cached) : null;
    }

    try {
      const log = await this.redis.get(logKey);
      if (log) {
        return JSON.parse(log);
      }
      return null;
    } catch (e) {
      this.logger.warn(`Redis failed to get, falling back to memory: ${e}`);
      this.useMemory = true;
      const cached = this.memoryCache.get(logKey);
      return cached ? JSON.parse(cached) : null;
    }
  }

  async save(key: string, userId: string, endpoint: string, status: number, body: any) {
    const logKey = `idempotency_result:${userId}:${key}`;
    const payload = JSON.stringify({ status, body });
    this.memoryCache.set(logKey, payload);

    if (!this.useMemory) {
      try {
        await this.redis.set(logKey, payload, 'EX', 86400);
      } catch (e) {
        this.logger.warn(`Redis failed to save, using memory only: ${e}`);
        this.useMemory = true;
      }
    }
  }
}
