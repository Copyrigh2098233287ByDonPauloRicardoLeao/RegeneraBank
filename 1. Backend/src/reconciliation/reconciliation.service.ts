import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { AccountEntity } from '../core/entities/account.entity';
import { TransactionEntity } from '../core/entities/transaction.entity';
import { OutboxEventEntity } from '../core/entities/outbox-event.entity';
import { MetricsService } from '../metrics/metrics.service';

@Injectable()
export class ReconciliationService {
  private readonly logger = new Logger(ReconciliationService.name);

  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepo: Repository<AccountEntity>,
    @InjectRepository(TransactionEntity)
    private readonly txRepo: Repository<TransactionEntity>,
    @InjectRepository(OutboxEventEntity)
    private readonly outboxRepo: Repository<OutboxEventEntity>,
    private readonly metricsService: MetricsService,
  ) {}

  @Cron(process.env.RECONCILIATION_CRON || '0 * * * *')
  async runHourlyReconciliation() {
    if (process.env.RECONCILIATION_ENABLED === 'false') {
      this.logger.log(
        'Reconciliação automática desativada (RECONCILIATION_ENABLED=false).',
      );
      return;
    }
    return this.runAutomatedReconciliation();
  }

  /**
   * Vigia do Banco: Valida o saldo da conta com a soma de todas as transações do Ledger.
   */
  async runAutomatedReconciliation() {
    const startTime = Date.now();
    this.logger.log('Iniciando conciliação automática...');
    const accounts = await this.accountRepo.find();

    for (const account of accounts) {
      const txs = await this.txRepo.find({
        where: { accountId: account.id },
      });

      const ledgerSum = txs.reduce((acc, tx) => {
        return acc + Number(tx.amountCents);
      }, 0);

      if (Number(account.balanceCents) !== ledgerSum) {
        this.logger.error(
          `[CRITICAL ALERTA VIGIA] Divergência na conta ${account.id} (Neural ID: ${account.neuralId}). Saldo: ${account.balanceCents}, Ledger: ${ledgerSum}`,
        );

        // Ação: Congelar conta
        account.status = 'FROZEN';
        await this.accountRepo.save(account);

        // Incrementar métrica
        this.metricsService.incrementLedgerBalanceDivergence();

        // Registrar no Outbox
        const outbox = this.outboxRepo.create({
          topic: 'account.frozen',
          payload: {
            accountId: account.id,
            neuralId: account.neuralId,
            reason: `Reconciliation divergence: Balance ${account.balanceCents} cents, Transaction sum ${ledgerSum} cents.`,
            timestamp: new Date().toISOString(),
          },
        });
        await this.outboxRepo.save(outbox);
      } else {
        this.logger.log(`Conta ${account.neuralId} reconciliada com sucesso.`);
      }
    }

    const durationSeconds = (Date.now() - startTime) / 1000;
    this.metricsService.setReconciliationDuration(durationSeconds);
    this.logger.log(`Conciliação finalizada em ${durationSeconds}s.`);
  }
}
