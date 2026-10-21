import { type IRepository } from '@/common/interfaces/repositories.interface';

import { Category } from '../entities/category.entity';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { ResponseCategoriesDto } from '../dto/response/response-categories.dto';

export interface ICategoriesRepository extends IRepository<
  Category,
  CreateCategoryDto,
  UpdateCategoryDto
> {
  findByName(name: string): Promise<Category | null>;
  getAllCategories(userId: string): Promise<ResponseCategoriesDto[]>;
}
