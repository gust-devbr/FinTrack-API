import { IntersectionType, ApiProperty } from '@nestjs/swagger';

import { AccessTokenDto, RefreshTokenDto } from './response-tokens.dto';
import { ResponseUserDto } from '@/modules/users/dto/response/response-user.dto';

export class ResponseAuthDto extends IntersectionType(
  AccessTokenDto,
  RefreshTokenDto,
) {
  @ApiProperty({ description: 'Usuário autenticado' })
  user!: ResponseUserDto;
}
