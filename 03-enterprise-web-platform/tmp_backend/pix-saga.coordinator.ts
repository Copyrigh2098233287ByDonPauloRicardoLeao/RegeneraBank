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
import { Injectable, Logger } from '@nestjs/common';
import { PubSubClientService } from '../pubsub/pubsub-client';

export interface PixTransaction {
  id: string;
  accountId: string;
  amount: number;
  receiverKey: string;
}

@Injectable()
export class PixSagaCoordinator {
  private readonly logger = new Logger(PixSagaCoordinator.name);

  constructor(
    private readonly pubsubService: PubSubClientService,
    // LedgerService and CelcoinApiService seriam injetados aqui
    // private readonly ledgerService: LedgerService,
    // private readonly celcoinService: CelcoinApiService
  ) {}

  async executePixTransfer(transaction: PixTransaction): Promise<void> {
    this.logger.log(`Starting PIX SAGA for transaction: ${transaction.id}`);

    try {
      // 1. Reserva de Saldo (Ledger)
      await this.reserveBalance(transaction);

      try {
        // 2. Chamada Externa (Celcoin)
        const externalId = await this.callExternalPixProvider(transaction);

        // 3. Confirmação (Ledger)
        await this.confirmBalanceDeduction(transaction, externalId);

        // 4. Notificação
        await this.notifySuccess(transaction);
        this.logger.log(`PIX SAGA completed successfully for transaction: ${transaction.id}`);

      } catch (externalError: any) {
        // Falha externa: Disparar Compensação
        this.logger.error(`External PIX failure, rolling back reservation for ${transaction.id}`);
        await this.compensateReservation(transaction);
        throw new Error(`PIX transfer failed at external provider: ${externalError.message}`);
      }
    } catch (error: any) {
      this.logger.error(`PIX SAGA failed for ${transaction.id}: ${error.message}`);
      await this.notifyFailure(transaction, error.message);
      throw error;
    }
  }

  private async reserveBalance(tx: PixTransaction): Promise<void> {
    this.logger.debug(`[Step 1] Reserving ${tx.amount} for account ${tx.accountId}`);
    // Simulate Ledger Reservation
    // await this.ledgerService.holdBalance(tx.accountId, tx.amount, tx.id);
  }

  private async callExternalPixProvider(tx: PixTransaction): Promise<string> {
    this.logger.debug(`[Step 2] Calling external provider to process PIX to ${tx.receiverKey}`);
    // Simulate External Call
    // return await this.celcoinService.sendPix(tx);
    return 'ext_123456789';
  }

  private async confirmBalanceDeduction(tx: PixTransaction, externalId: string): Promise<void> {
    this.logger.debug(`[Step 3] Confirming deduction on ledger for ${tx.id} with external ID ${externalId}`);
    // Simulate Ledger Confirmation
    // await this.ledgerService.commitHold(tx.accountId, tx.id);
  }

  private async compensateReservation(tx: PixTransaction): Promise<void> {
    this.logger.warn(`[Compensation] Reversing balance hold for ${tx.id}`);
    // Simulate Ledger Rollback
    // await this.ledgerService.releaseHold(tx.accountId, tx.id);
  }

  private async notifySuccess(tx: PixTransaction): Promise<void> {
    this.logger.debug(`[Step 4] Notifying success for ${tx.id}`);
    await this.pubsubService.publishMessage('notifications', {
      type: 'PIX_SUCCESS',
      userId: tx.accountId,
      amount: tx.amount,
      txId: tx.id
    });
  }

  private async notifyFailure(tx: PixTransaction, reason: string): Promise<void> {
    this.logger.debug(`Notifying failure for ${tx.id}`);
    await this.pubsubService.publishMessage('notifications', {
      type: 'PIX_FAILED',
      userId: tx.accountId,
      amount: tx.amount,
      txId: tx.id,
      reason
    });
  }
}
