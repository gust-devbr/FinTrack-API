import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty({ description: 'ID do usuário' })
  id!: string;

  @ApiProperty({ description: 'Nome do usuário' })
  name!: string;

  @ApiProperty({ description: 'E-mail do usuário' })
  email!: string;

  @ApiProperty({ description: 'Senha do usuário' })
  password!: string;

  @ApiProperty({ description: 'Data de criação do usuário' })
  createdAt!: Date;
}
