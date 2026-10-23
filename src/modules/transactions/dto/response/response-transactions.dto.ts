import { ApiProperty } from '@nestjs/swagger';
import { Transaction } from '../../entities/transaction.entity';
import { BaseResponseDto } from '@/common/dtos/base-response.dto';
import { SummaryResponseDto } from './summary-response.dto';

class TransactionCategory {
  @ApiProperty({
    description: 'ID da categoria',
    type: 'string',
  })
  id!: string;

  @ApiProperty({
    description: 'Nome da categoria',
    type: 'string',
  })
  name!: string;
}

export class ResponseTransactionsData extends Transaction {
  @ApiProperty({ type: TransactionCategory })
  category!: TransactionCategory;
}

class ReturnTransactions {
  @ApiProperty({ type: SummaryResponseDto })
  summary!: SummaryResponseDto;

  @ApiProperty({ type: [ResponseTransactionsData] })
  transactions!: [ResponseTransactionsData];
}

export class ResponseTransactionDto extends BaseResponseDto<ReturnTransactions> {
  @ApiProperty({ type: ReturnTransactions })
  declare data: ReturnTransactions;
}
