import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AccessTokenDto {
  @ApiProperty({ description: 'Token de acesso (20 minutos)' })
  accessToken!: string;
}

export class RefreshTokenDto {
  @ApiProperty({ description: 'Token de refresh (20 dias)' })
  @IsNotEmpty()
  @IsString()
  refreshToken!: string;
}
