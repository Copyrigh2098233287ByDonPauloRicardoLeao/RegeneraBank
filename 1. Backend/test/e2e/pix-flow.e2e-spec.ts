import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

/**
 * BACEN Audit: E2E Payment Flow (PIX)
 * Verifica o ciclo completo de uma transação SPI ponta a ponta.
 */
describe('PixFlow (e2e) - BACEN Compliance', () => {
  let app: INestApplication;

  beforeAll(async () => {
    // Inicialização real do módulo NestJS (sem mocks, utilizando DB em memória para testes)
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/webhook/pix (POST) - Recebimento de Pix SPI via DICT com assinatura HMAC', async () => {
    const payload = {
      eventId: `E2E_${Date.now()}`,
      type: 'PIX_RECEIVED',
      timestamp: new Date().toISOString(),
      data: {
        endToEndId: `E${Date.now()}`,
        amountCents: 150000, // R$ 1.500,00
        receiverKey: '12345678909',
        senderName: 'João da Silva',
        senderIspb: '12345678'
      }
    };

    // Assinatura de teste (simulando a gerada pelo WebhookService)
    const crypto = require('crypto');
    const secret = process.env.WEBHOOK_SECRET || 'default-secret-for-dev';
    const signature = crypto.createHmac('sha256', secret).update(JSON.stringify(payload)).digest('hex');

    return request(app.getHttpServer())
      .post('/webhook/pix')
      .set('x-webhook-signature', signature)
      .send(payload)
      .expect(HttpStatus.CREATED)
      .expect((res) => {
        expect(res.body.status).toEqual('RECEIVED');
        expect(res.body.eventId).toEqual(payload.eventId);
      });
  });

  it('/pix/transfer (POST) - Teto noturno do Bacen (Normativa 142) deve bloquear envios acima do limite', async () => {
    // Assumindo que a API de Transferência requer Autenticação Bearer (Mockada/Gerada para o E2E)
    const token = 'mock_jwt_token_for_e2e';
    
    return request(app.getHttpServer())
      .post('/pix/transfer')
      .set('Authorization', `Bearer ${token}`)
      .send({
        receiverKey: '98765432100',
        amountCents: 200000, // R$ 2.000,00 (Acima de R$ 1000 noturno)
      })
      .expect(HttpStatus.FORBIDDEN)
      .expect((res) => {
        expect(res.body.message).toContain('teto normativo do horário');
      });
  });
});
