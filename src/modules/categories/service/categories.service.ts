import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoriesRepository } from '../repository/categories.repository';

import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async create(userId: string, createCategoryDto: CreateCategoryDto) {
    const category = await this.categoriesRepository.create({
      userId,
      ...createCategoryDto,
    });

    return {
      message: 'Categoria criada',
      category,
    };
  }

  async findAll(userId: string) {
    const categories = await this.categoriesRepository.getAllCategories(userId);
    return { categories };
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoriesRepository.findById(id);
    if (!category) throw new NotFoundException('Categoria não encontrada');

    const updatedCategory = await this.categoriesRepository.update({
      id: category.id,
      ...updateCategoryDto,
    });

    return {
      message: 'Categoria atualizada',
      category: updatedCategory,
    };
  }

  async remove(id: string) {
    const category = await this.categoriesRepository.findById(id);
    if (!category) throw new NotFoundException('Categoria não encontrada');

    await this.categoriesRepository.remove(category.id);

    return { message: 'Categoria excluída' };
  }
}
