import { type IRepository } from '@/common/interfaces/repositories.interface';

import { Transaction } from '../entities/transaction.entity';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { SummaryResponseDto } from '../dto/response/summary-response.dto';
import { ResponseTransactionsData } from '../dto/response/response-transactions.dto';

export interface ITransactionsRepository extends IRepository<
  Transaction,
  CreateTransactionDto,
  UpdateTransactionDto
> {
  findAll(userId: string): Promise<ResponseTransactionsData[]>;

  calculate(userId: string): Promise<SummaryResponseDto>;
}
