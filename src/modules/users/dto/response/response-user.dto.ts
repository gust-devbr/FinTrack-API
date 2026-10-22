import { ApiProperty, OmitType } from '@nestjs/swagger';
import { User } from '../../entities/user.entity';
import { BaseResponseDto } from '@/common/dtos/base-response.dto';

export class ResponseUserData extends OmitType(User, ['password'] as const) {}

class ReturnUser {
  @ApiProperty({ type: ResponseUserData })
  user!: ResponseUserData;
}

export class ResponseUserDto extends BaseResponseDto<ReturnUser> {
  @ApiProperty({ type: ReturnUser })
  declare data: ReturnUser;
}
