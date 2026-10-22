import { Module } from '@nestjs/common';

import { TransactionsService } from './service/transactions.service';
import { TransactionsController } from './controller/transactions.controller';
import { TransactionsRepository } from './repository/transactions.repository';

import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [TransactionsController],
  providers: [TransactionsService, TransactionsRepository],
  exports: [TransactionsService, TransactionsRepository],
})
export class TransactionsModule {}
