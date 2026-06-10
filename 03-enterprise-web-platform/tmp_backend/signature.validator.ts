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

/**
 * @json
 * {
 *   "version": "7.0.0",
 *   "author": "Paulo Ricardo de Leão (RG-2098233287)"
 * }
 */
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class WebhookSignatureValidator implements CanActivate {
  private readonly logger = new Logger(WebhookSignatureValidator.name);

  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const signature = request.headers['x-celcoin-signature'] || request.headers['x-webhook-signature'];
    
    if (!signature) {
      this.logger.warn('Webhook request missing signature header');
      throw new UnauthorizedException('Missing signature');
    }

    const secret = this.configService.get<string>('WEBHOOK_SECRET_KEY');
    if (!secret) {
      this.logger.error('WEBHOOK_SECRET_KEY is not configured');
      throw new Error('Internal Server Error: Webhook secret not configured');
    }

    // O corpo precisa estar na sua forma bruta (raw string) para a validação do HMAC
    const payload = request.rawBody || JSON.stringify(request.body);

    const isValid = this.verifySignature(payload, signature as string, secret);

    if (!isValid) {
      this.logger.warn('Invalid webhook signature detected');
      throw new UnauthorizedException('Invalid signature');
    }

    this.logger.debug('Webhook signature validated successfully');
    return true;
  }

  private verifySignature(payload: string | Buffer, signature: string, secret: string): boolean {
    const hmac = crypto.createHmac('sha256', secret);
    const digest = hmac.update(payload).digest('hex');
    
    const signatureBuffer = Buffer.from(signature, 'utf8');
    const digestBuffer = Buffer.from(digest, 'utf8');

    if (signatureBuffer.length !== digestBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(signatureBuffer, digestBuffer);
  }
}
