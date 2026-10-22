import { BaseResponseDto } from '@/common/dtos/base-response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseCategoriesData {
  @ApiProperty({
    description: 'ID da categoria',
    example: '68f123456789012345678901',
  })
  id!: string;

  @ApiProperty({
    description: 'Nome da categoria',
    example: 'Alimentação',
  })
  name!: string;

  @ApiProperty({
    description: 'Data de criação da categoria',
    example: '2026-10-21T20:00:00.000Z',
    type: String,
    format: 'date-time',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'Quantidade de transações vinculadas à categoria',
    example: 12,
  })
  transactionCount!: number;

  @ApiProperty({
    description: 'Valor total das transações da categoria',
    example: 850.5,
    type: Number,
  })
  totalAmount!: number;
}

class ReturnCategories {
  @ApiProperty({ type: [ResponseCategoriesData] })
  categories!: [ResponseCategoriesData];
}

export class ResponseCategoriesDto extends BaseResponseDto<ReturnCategories> {
  @ApiProperty({ type: ReturnCategories })
  declare data: ReturnCategories;
}
