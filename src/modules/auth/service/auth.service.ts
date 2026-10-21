import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/database/prisma.service';
import * as bcrypt from 'bcrypt';

import { RegisterDto } from '../dto/register.dto';
import { SignInDto } from '../dto/sign-in.dto';

import { UsersRepository } from '@/modules/users/repository/users.repository';
import { ResponseUser } from '@/common/filters/response-user';
import { UserPayload } from '../types/user-payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly usersRepository: UsersRepository,
  ) {}

  async register(registerDto: RegisterDto) {
    const existsUser = await this.usersRepository.findByEmail(
      registerDto.email,
    );
    if (existsUser) throw new ConflictException('Usuário já cadastrado');

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = await this.usersRepository.create({
      ...registerDto,
      password: hashedPassword,
    });

    const tokens = await this.generateTokens(user.id);

    return {
      message: 'Cadastrado com sucesso',
      ...tokens,
      user: ResponseUser.from(user),
    };
  }

  async signIn(signInDto: SignInDto) {
    const existsUser = await this.usersRepository.findByEmail(signInDto.email);
    if (!existsUser) throw new UnauthorizedException('Credenciais inválidas');

    const isValid = await bcrypt.compare(
      signInDto.password,
      existsUser.password,
    );
    if (!isValid) throw new UnauthorizedException('Credenciais inválidas');

    const tokens = await this.generateTokens(existsUser.id);

    return {
      message: 'Logado com sucesso',
      ...tokens,
      user: ResponseUser.from(existsUser),
    };
  }

  async refresh(refreshToken: string) {
    let payload: UserPayload;

    try {
      payload = await this.jwtService.verifyAsync<UserPayload>(refreshToken, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Refresh token inválido ou expirado');
    }

    const token = await this.prisma.refreshToken.findFirst({
      where: {
        token: refreshToken,
        userId: payload.sub,
      },
    });

    if (!token) {
      throw new UnauthorizedException(
        'Refresh token não encontrado ou revogado',
      );
    }

    const accessToken = await this.jwtService.signAsync(
      { sub: payload.sub },
      {
        secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
        expiresIn: '15m',
      },
    );

    return { accessToken };
  }

  async logout(refreshToken: string) {
    await this.prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });

    return { message: 'Logout realizado com sucesso' };
  }

  private async generateTokens(userId: string) {
    const accessToken = await this.jwtService.signAsync(
      { sub: userId },
      {
        secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
        expiresIn: '20min',
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      { sub: userId },
      {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
        expiresIn: '20d',
      },
    );

    await this.prisma.refreshToken.upsert({
      where: { userId },
      update: { token: refreshToken },
      create: {
        token: refreshToken,
        userId,
      },
    });

    return { accessToken, refreshToken };
  }
}
