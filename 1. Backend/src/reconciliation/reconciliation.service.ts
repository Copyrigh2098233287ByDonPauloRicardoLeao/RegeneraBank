import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountEntity } from '../core/entities/account.entity';
import { LedgerEntryEntity } from '../core/entities/ledger-entry.entity';

@Injectable()
export class ReconciliationService {
  private readonly logger = new Logger(ReconciliationService.name);

  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepo: Repository<AccountEntity>,
    @InjectRepository(LedgerEntryEntity)
    private readonly ledgerRepo: Repository<LedgerEntryEntity>,
  ) {}

  /**
   * CRON JOB MOCK (Seria executado por @Cron('0 * * * *'))
   * Vigia do Banco: Valida o saldo da conta com a soma do Ledger.
   */
  async runAutomatedReconciliation() {
    this.logger.log('Iniciando conciliação automática...');
    const accounts = await this.accountRepo.find();

    for (const account of accounts) {
      const ledgerEntries = await this.ledgerRepo.find({ where: { neuralId: account.neuralId } as any });
      
      const ledgerSum = ledgerEntries.reduce((acc, entry) => {
        return acc + Number(entry.amountCents);
      }, 0);

      if (Number(account.balanceCents) !== ledgerSum) {
        this.logger.error(`[ALERTA VIGIA] Divergência na conta ${account.neuralId}. Saldo: ${account.balanceCents}, Ledger: ${ledgerSum}`);
        // Ação: Congelar conta
        account.status = 'FROZEN';
        await this.accountRepo.save(account);
      } else {
        this.logger.log(`Conta ${account.neuralId} reconciliada com sucesso.`);
      }
    }
    
    this.logger.log('Conciliação finalizada.');
  }
}
