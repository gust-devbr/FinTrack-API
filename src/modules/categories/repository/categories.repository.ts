import { PrismaService } from '@/database/prisma.service';
import { Injectable } from '@nestjs/common';

import { ICategoriesRepository } from './interface-categories.repository';

import { Category } from '../entities/category.entity';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { ResponseCategoriesData } from '../dto/response/response-categories.dto';

@Injectable()
export class CategoriesRepository implements ICategoriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getAllCategories(userId: string): Promise<ResponseCategoriesData[]> {
    const categories = await this.prisma.category.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        color: true,
        createdAt: true,
        _count: {
          select: {
            transaction: true,
          },
        },
      },
    });

    const totals = await this.prisma.transaction.groupBy({
      by: ['categoryId'],
      where: { userId },
      _sum: {
        amount: true,
      },
    });

    return categories.map((category) => {
      const total = totals.find((item) => item.categoryId === category.id);

      return {
        id: category.id,
        name: category.name,
        color: category.color,
        createdAt: category.createdAt,
        transactionCount: category._count.transaction,
        totalAmount: total?._sum.amount ?? 0,
      };
    });
  }

  async findByName(name: string): Promise<Category | null> {
    return await this.prisma.category.findFirst({ where: { name } });
  }

  async findById(id: string): Promise<Category | null> {
    return await this.prisma.category.findFirst({ where: { id } });
  }

  async create(
    data: CreateCategoryDto & { userId: string },
  ): Promise<Category> {
    return await this.prisma.category.create({ data });
  }

  async update({
    id,
    ...data
  }: UpdateCategoryDto & { id: string }): Promise<Category> {
    return await this.prisma.category.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.category.delete({ where: { id } });
  }
}
