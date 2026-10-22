import { ApiProperty } from '@nestjs/swagger';
import { TransactionType } from '@prisma/client';

export class Transaction {
  @ApiProperty({ description: 'ID da transação' })
  id!: string;

  @ApiProperty({ description: 'ID do usuário' })
  userId!: string;

  @ApiProperty({ description: 'Título da transação' })
  title!: string;

  @ApiProperty({ description: 'Valor da transação' })
  amount!: number;

  @ApiProperty({ description: 'ID da categoria' })
  categoryId!: string;

  @ApiProperty({
    description: 'Tipo da transação',
    example: TransactionType.INCOME,
  })
  type!: TransactionType;

  @ApiProperty({ description: 'Data de criação da transação' })
  createdAt!: Date;

  @ApiProperty({ description: 'Data de atualização da transação' })
  updatedAt!: Date;
}
