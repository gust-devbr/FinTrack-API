import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class DeleteUserDto {
  @ApiProperty({ description: 'Senha do usuário', type: 'string' })
  @IsString()
  @IsNotEmpty()
  password!: string;
}
