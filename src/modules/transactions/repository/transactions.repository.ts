import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';

import { Transaction } from '../entities/transaction.entity';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { SummaryResponseDto } from '../dto/response/summary-response.dto';
import { ResponseTransactionsData } from '../dto/response/response-transactions.dto';

import { ITransactionsRepository } from './interface-transactions.repository';

@Injectable()
export class TransactionsRepository implements ITransactionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async calculate(userId: string): Promise<SummaryResponseDto> {
    const [income, expense] = await Promise.all([
      this.prisma.transaction.aggregate({
        where: { userId, type: 'INCOME' },
        _sum: { amount: true },
      }),
      this.prisma.transaction.aggregate({
        where: { userId, type: 'EXPENSE' },
        _sum: { amount: true },
      }),
    ]);

    return {
      income: income._sum.amount ?? 0,
      expense: expense._sum.amount ?? 0,
      balance: (income._sum.amount ?? 0) - (expense._sum.amount ?? 0),
    };
  }

  async findAll(userId: string): Promise<ResponseTransactionsData[]> {
    return await this.prisma.transaction.findMany({
      where: { userId },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findById(id: string): Promise<Transaction | null> {
    return await this.prisma.transaction.findFirst({ where: { id } });
  }

  async create(
    data: CreateTransactionDto & { userId: string },
  ): Promise<Transaction> {
    return await this.prisma.transaction.create({ data });
  }

  async update({
    id,
    ...data
  }: UpdateTransactionDto & { id: string }): Promise<Transaction> {
    return await this.prisma.transaction.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.transaction.delete({ where: { id } });
  }
}
