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

import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { AccountEntity } from './core/entities/account.entity';
import { TransactionEntity } from './core/entities/transaction.entity';
import { UserEntity } from './core/entities/user.entity';
import { InvestmentEntity } from './investments/entities/investment.entity';

import { PixKeyEntity } from './core/entities/pix-key.entity';
import { IdempotencyLogEntity } from './core/entities/idempotency-log.entity';

config();

const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: process.env.NODE_ENV === 'production' },
  entities: [
    UserEntity,
    AccountEntity,
    TransactionEntity,
    InvestmentEntity,
    PixKeyEntity,
    IdempotencyLogEntity,
  ],
  migrations: ['src/migrations/*.ts', 'dist/src/migrations/*.js'],
  synchronize: false,
  logging: false,
});

export default AppDataSource;
