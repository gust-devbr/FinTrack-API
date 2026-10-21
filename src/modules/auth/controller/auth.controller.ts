import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthService } from '../service/auth.service';
import { BaseResponseDto } from '@/common/dtos/base-response.dto';

import {
  AccessTokenDto,
  RefreshTokenDto,
} from '../dto/response/response-tokens.dto';
import { RegisterDto } from '../dto/register.dto';
import { SignInDto } from '../dto/sign-in.dto';
import { ResponseAuthDto } from '../dto/response/response-auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({
    status: 201,
    description: 'Cadastrar usuário',
    type: ResponseAuthDto,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(@Body() createAuthDto: RegisterDto) {
    return await this.authService.register(createAuthDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Logar usuário',
    type: ResponseAuthDto,
  })
  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto) {
    return await this.authService.signIn(signInDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Refresh token',
    type: AccessTokenDto,
  })
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(@Body() { refreshToken }: RefreshTokenDto) {
    return await this.authService.refresh(refreshToken);
  }

  @ApiResponse({
    status: 200,
    description: 'Logout do usuário',
    type: BaseResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@Body() { refreshToken }: RefreshTokenDto) {
    return await this.authService.logout(refreshToken);
  }
}
