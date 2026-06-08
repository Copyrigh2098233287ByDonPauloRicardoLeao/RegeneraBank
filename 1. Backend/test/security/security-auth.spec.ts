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

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('Security Audit (e2e) - OWASP Top 10 Mitigation', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('A1: Injection - Deve mitigar SQL Injection nos endpoints expostos', async () => {
    return request(app.getHttpServer())
      .get('/core/dashboard')
      .set('Authorization', 'Bearer MOCK_TOKEN')
      .set('neuralId', "1 OR 1=1; DROP TABLE users;--")
      .expect(HttpStatus.FORBIDDEN); // O guard de segurança e sanitização deve bloquear payloads maliciosos
  });

  it('A5: Security Misconfiguration - Headers de Segurança (CORS, HSTS, X-Frame-Options) devem estar presentes', async () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect((res) => {
        // Validação da biblioteca Helmet
        expect(res.headers['strict-transport-security']).toBeDefined();
        expect(res.headers['x-frame-options']).toBe('SAMEORIGIN');
        expect(res.headers['x-content-type-options']).toBe('nosniff');
      });
  });

  it('A7: Cross-Site Scripting (XSS) - O input deve ser limpo/rejeitado', async () => {
    return request(app.getHttpServer())
      .post('/lifestyle/dream/create')
      .set('Authorization', 'Bearer MOCK_TOKEN')
      .send({
        name: "<script>alert('hack')</script> Viagem",
        targetCents: 50000
      })
      .expect(HttpStatus.BAD_REQUEST); // Validação de Input DTO deve rejeitar tags HTML
  });
});
