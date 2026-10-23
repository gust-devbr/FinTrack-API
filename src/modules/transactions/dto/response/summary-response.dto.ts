import { ApiProperty } from '@nestjs/swagger';

export class SummaryResponseDto {
  @ApiProperty({
    description: 'Valor total de todas as transações do tipo Receita',
  })
  income!: number;

  @ApiProperty({
    description: 'Valor total de todas as transações do tipo Despesa',
  })
  expense!: number;

  @ApiProperty({
    description: 'Valor total da difença entre Receitas e Despesas',
  })
  balance!: number;
}
