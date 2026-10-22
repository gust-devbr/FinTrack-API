import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

import { TransactionsService } from '../service/transactions.service';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { ResponseTransactionDto } from '../dto/response/response-transactions.dto';

import { AuthGuard } from '@/modules/auth/guard/auth.guard';
import { UserId } from '@/common/decorators/user-id.decorator';
import { BaseResponseDto } from '@/common/dtos/base-response.dto';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @ApiResponse({
    status: 201,
    description: 'Criar transação',
    type: BaseResponseDto,
  })
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(
    @UserId() userId: string,
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    return await this.transactionsService.create(userId, createTransactionDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Buscar todas as transações do usuário',
    type: ResponseTransactionDto,
  })
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(@UserId() userId: string) {
    return await this.transactionsService.findAll(userId);
  }

  @ApiResponse({
    status: 200,
    description: 'Atualizar transação',
    type: BaseResponseDto,
  })
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return await this.transactionsService.update(id, updateTransactionDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Excluir transação',
    type: BaseResponseDto,
  })
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.transactionsService.remove(id);
  }
}
