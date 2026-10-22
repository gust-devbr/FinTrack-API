import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { TransactionType } from '@prisma/client';

export class CreateTransactionDto {
  @ApiProperty({
    description: 'Título da transação',
    example: 'Salário',
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({
    description: 'Valor da transação',
    example: 50000,
    type: 'number',
  })
  @Type(() => Number)
  @IsNotEmpty()
  amount!: number;

  @ApiProperty({
    description: 'Categoria da transação',
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  categoryId!: string;

  @ApiProperty({
    description: 'Tipo da transação',
    examples: ['INCOME', 'EXPENSE'],
    type: 'string',
  })
  @IsEnum(TransactionType)
  @IsNotEmpty()
  type!: TransactionType;
}
