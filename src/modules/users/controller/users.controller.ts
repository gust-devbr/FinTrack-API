import {
  Controller,
  Get,
  Put,
  Body,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { UsersService } from '../service/users.service';

import { DeleteUserDto } from '../dto/delete-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ResponseUserDto } from '../dto/response/response-user.dto';

import { UserId } from '@/common/decorators/user-id.decorator';
import { BaseResponseDto } from '@/common/dtos/base-response.dto';
import { AuthGuard } from '@/modules/auth/guard/auth.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiResponse({
    status: 200,
    description: 'Buscar dados do usuário',
    type: ResponseUserDto,
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Get('me')
  async findMe(@UserId() userId: string) {
    return await this.usersService.findOne(userId);
  }

  @ApiResponse({
    description: 'Atualizar dados do usuário',
    type: BaseResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Put('me')
  async update(@UserId() userId: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(userId, updateUserDto);
  }

  @ApiResponse({
    description: 'Deletar conta do usuário',
    type: BaseResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Delete('me')
  async remove(@UserId() userId: string, @Body() deleteUserDto: DeleteUserDto) {
    return await this.usersService.remove(userId, deleteUserDto);
  }
}
