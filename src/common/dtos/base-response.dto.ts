import { ApiProperty } from '@nestjs/swagger';

export class BaseResponseDto<T = null> {
  @ApiProperty({ example: true })
  success!: boolean;

  @ApiProperty({ example: 'Operação realizada com sucesso' })
  message!: string;

  data!: T;
}
