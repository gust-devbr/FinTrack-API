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
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { ResponseCategoriesDto } from '../dto/response/response-categories.dto';
import { CategoriesService } from '../service/categories.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

import { UserId } from '@/common/decorators/user-id.decorator';
import { BaseResponseDto } from '@/common/dtos/base-response.dto';
import { AuthGuard } from '@/modules/auth/guard/auth.guard';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiResponse({
    status: 201,
    description: 'Criar categoria',
    type: BaseResponseDto,
  })
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(
    @UserId() userId: string,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    return await this.categoriesService.create(userId, createCategoryDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Buscar todas as categorias do usuário',
    type: [ResponseCategoriesDto],
  })
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(@UserId() userId: string) {
    return await this.categoriesService.findAll(userId);
  }

  @ApiResponse({
    status: 200,
    description: 'Atualizar categoria',
    type: BaseResponseDto,
  })
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return await this.categoriesService.update(id, updateCategoryDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Excluir categoria',
    type: BaseResponseDto,
  })
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.categoriesService.remove(id);
  }
}
