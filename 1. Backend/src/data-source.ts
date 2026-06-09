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
|  --> CLASSIFICATION: PROPRIETARY // DEVELOPER MAINTAINED // REQUIRES SENIOR REVIEW    |
|---------------------------------------------------------------------------------------|
*/

import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';

config();

const nodeEnv = process.env.NODE_ENV ?? 'development';
const isProduction = nodeEnv === 'production';
const isCompiledRuntime = __filename.endsWith('.js');

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    '[RegeneraBank/DataSource] DATABASE_URL is required for TypeORM migrations and runtime database access.',
  );
}

/**
 * TypeORM glob paths must be stable across:
 * - local TS runtime via ts-node
 * - Jest/E2E runtime
 * - compiled JS runtime inside dist/
 */
const normalizeGlob = (path: string): string => path.replace(/\\/g, '/');

const runtimeExtension = isCompiledRuntime ? 'js' : 'ts';

/**
 * When running from:
 * - src/data-source.ts  -> __dirname points to src/
 * - dist/data-source.js -> __dirname points to dist/
 */
const entitiesGlob = normalizeGlob(
  join(__dirname, `**/*.entity.${runtimeExtension}`),
);

const migrationsGlob = normalizeGlob(
  join(__dirname, `migrations/*.${runtimeExtension}`),
);

/**
 * Banking-grade SSL behavior:
 * - test/local: disabled unless DB_SSL=true
 * - production: enabled with certificate validation
 */
const shouldUseSsl = isProduction || process.env.DB_SSL === 'true';

if (isProduction && process.env.DB_SSL_REJECT_UNAUTHORIZED === 'false') {
  throw new Error(
    '[RegeneraBank/DataSource] DB_SSL_REJECT_UNAUTHORIZED=false is not allowed in production.',
  );
}

const ssl = shouldUseSsl
  ? {
    rejectUnauthorized:
      process.env.DB_SSL_REJECT_UNAUTHORIZED === 'false' && !isProduction
        ? false
        : true,
    ca: process.env.DB_CA_CERT?.replace(/\\n/g, '\n'),
  }
  : false;

const AppDataSource = new DataSource({
  type: 'postgres',
  url: databaseUrl,
  ssl,
  entities: [entitiesGlob],
  migrations: [migrationsGlob],
  synchronize: false,
  logging: process.env.TYPEORM_LOGGING === 'true',
});

export default AppDataSource;
