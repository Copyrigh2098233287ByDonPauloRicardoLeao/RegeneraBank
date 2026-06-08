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

import { Injectable, ForbiddenException, Logger, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { LedgerService } from '../ledger/ledger.service';
import { IdempotencyRepository } from '../idempotency/idempotency.repository';
import { AccountEntity } from '../accounts/account.entity';

interface PixSpiPayload {
  endToEndId: string;
  amountCents: number;
  receiverKey: string;
  senderName: string;
  senderIspb: string;
}

@Injectable()
export class PixService {
  private readonly logger = new Logger('Pix_SPI_Engine');
  
  // Limites globais do BACEN (Normativa 142)
  private readonly GLOBAL_LIMIT_DAY_CENTS = 5000000; // R$ 50.000,00
  private readonly GLOBAL_LIMIT_NIGHT_CENTS = 100000; // R$ 1.000,00

  constructor(
    @Inject(forwardRef(() => LedgerService))
    private readonly ledgerService: LedgerService,
    private readonly idempotencyGuard: IdempotencyRepository,
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
  ) {}

  /**
   * Processamento Inbound (Recebimento SPI via DICT)
   * Garante a não-duplicação e credita na conta-corrente o valor.
   */
  async processIncomingPix(data: PixSpiPayload, idempotencyKey: string) {
    this.logger.log(`[SPI INBOUND] Recebendo PIX E2E: ${data.endToEndId} | Origem: ${data.senderIspb}`);

    if (!data.amountCents || data.amountCents <= 0) {
      throw new BadRequestException('Valor transacional inválido para compensação SPI.');
    }

    // Controle Absoluto de Double-Spend (Idempotência BACEN)
    const isProcessed = await this.idempotencyGuard.exists(idempotencyKey);
    if (isProcessed) {
      this.logger.warn(`[SPI INBOUND] Replay detectado e descartado para IdempotencyKey: ${idempotencyKey}`);
      const cached = await this.idempotencyGuard.get(idempotencyKey);
      return cached.payload;
    }

    await this.idempotencyGuard.lock(idempotencyKey);

    try {
      // Localiza a conta de destino baseada na Chave PIX (Neste modelo, usamos o NeuralID como surrogate)
      const receiverAccount = await this.accountRepository.findOne({ where: { neuralId: data.receiverKey } as any });
      
      if (!receiverAccount) {
        throw new BadRequestException('Chave PIX de destino inexistente no DICT Regenera.');
      }

      // Executa o Crédito via Motor ACID do Ledger
      await this.ledgerService.credit(receiverAccount.id, data.amountCents, {
        endToEndId: data.endToEndId,
        type: 'PIX_INBOUND_SPI',
        counterpartyName: data.senderName,
      });

      const response = { 
        status: 'SETTLED', 
        endToEndId: data.endToEndId,
        settledAt: new Date().toISOString()
      };

      await this.idempotencyGuard.save(idempotencyKey, response);
      this.logger.log(`[SPI INBOUND] Pix liquidado com sucesso na conta ${receiverAccount.accountNumber}.`);

      return response;

    } catch (error) {
      await this.idempotencyGuard.unlock(idempotencyKey);
      this.logger.error(`[CRÍTICO] Falha na liquidação SPI Inbound E2E: ${data.endToEndId}. Motivo: ${error.message}`);
      throw error;
    }
  }

  /**
   * Validador Robusto de Limites Transacionais (Outbound)
   * Analisa horário bancário, limites globais e limites customizados do perfil do cliente.
   */
  async validateLimits(accountId: string, amountCents: number, timestamp: Date = new Date()): Promise<void> {
    const isNight = timestamp.getHours() >= 20 || timestamp.getHours() < 6;
    
    // 1. Limites Globais (Norma BACEN)
    const globalLimit = isNight ? this.GLOBAL_LIMIT_NIGHT_CENTS : this.GLOBAL_LIMIT_DAY_CENTS;
    if (amountCents > globalLimit) {
      this.logger.warn(`[BLOQUEIO BACEN] Tentativa de transação acima do teto normativo global (Conta: ${accountId})`);
      throw new ForbiddenException(`A transação excede o teto normativo do horário ${isNight ? 'noturno' : 'diurno'} do BACEN.`);
    }

    // 2. Limites Customizados do Cliente (Conta-Corrente)
    const account = await this.accountRepository.findOne({ where: { id: accountId } });
    if (!account) throw new BadRequestException('Conta origem inválida para validação de limites.');

    // Considerando que `customDailyLimitCents` existe na AccountEntity (ou assume o default)
    const userLimit = (account as any).customDailyLimitCents ?? globalLimit;
    
    if (amountCents > userLimit) {
      throw new ForbiddenException(`Valor supera o seu limite diário customizado (R$ ${(userLimit / 100).toFixed(2)}). Ajuste-o no App.`);
    }

    // 3. Acúmulo de Transações (Janela Diária)
    // Na vida real, chamaríamos o Ledger para somar os débitos das últimas 24h.
    const todayVolumeCents = await this.ledgerService.calculateDailyVolume(accountId);
    if ((todayVolumeCents + amountCents) > userLimit) {
      throw new ForbiddenException('A soma das suas transações de hoje excede o limite diário permitido.');
    }
    
    this.logger.log(`[COMPLIANCE] Limites validados para conta ${accountId}. Volume de hoje: ${todayVolumeCents}c`);
  }
}
