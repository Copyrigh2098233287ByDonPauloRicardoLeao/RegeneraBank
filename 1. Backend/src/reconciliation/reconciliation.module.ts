import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from '../core/entities/account.entity';
import { TransactionEntity } from '../core/entities/transaction.entity';
import { OutboxEventEntity } from '../core/entities/outbox-event.entity';
import { ReconciliationService } from './reconciliation.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AccountEntity,
      TransactionEntity,
      OutboxEventEntity,
    ]),
  ],
  providers: [ReconciliationService],
  exports: [ReconciliationService],
})
export class ReconciliationModule {}
