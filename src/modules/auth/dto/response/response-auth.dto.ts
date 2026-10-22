import { IntersectionType, ApiProperty } from '@nestjs/swagger';

import { AccessTokenDto, RefreshTokenDto } from './response-tokens.dto';
import { ResponseUserDto } from '@/modules/users/dto/response/response-user.dto';
import { BaseResponseDto } from '@/common/dtos/base-response.dto';

export class ResponseAuthData extends IntersectionType(
  AccessTokenDto,
  RefreshTokenDto,
) {
  @ApiProperty({ description: 'Usuário autenticado', type: ResponseUserDto })
  user!: ResponseUserDto;
}

export class ResponseAuthDto extends BaseResponseDto<ResponseAuthData> {
  @ApiProperty({ type: ResponseAuthData })
  declare data: ResponseAuthData;
}
