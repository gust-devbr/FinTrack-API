import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';

import { TransactionsRepository } from '../repository/transactions.repository';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
  ) {}

  async create(userId: string, createTransactionDto: CreateTransactionDto) {
    const transaction = await this.transactionsRepository.create({
      userId,
      ...createTransactionDto,
    });

    return {
      message: 'Transação criada',
      transaction,
    };
  }

  async findAll(userId: string) {
    const transactions = await this.transactionsRepository.findAll(userId);
    return { transactions };
  }

  async update(id: string, updateTransactionDto: UpdateTransactionDto) {
    const transaction = await this.transactionsRepository.findById(id);
    if (!transaction) throw new NotFoundException('Transação não encontrada');

    const updated = await this.transactionsRepository.update({
      id: transaction.id,
      ...updateTransactionDto,
    });

    return {
      message: 'Transação atualizada',
      transaction: updated,
    };
  }

  async remove(id: string) {
    const transaction = await this.transactionsRepository.findById(id);
    if (!transaction) throw new NotFoundException('Transação não encontrada');

    await this.transactionsRepository.remove(transaction.id);

    return { message: 'Transação excluída' };
  }
}
