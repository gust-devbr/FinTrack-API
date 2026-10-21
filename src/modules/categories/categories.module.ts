import { Module } from '@nestjs/common';

import { CategoriesService } from './service/categories.service';
import { CategoriesController } from './controller/categories.controller';
import { CategoriesRepository } from './repository/categories.repository';

import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoriesRepository],
  exports: [CategoriesService, CategoriesRepository],
})
export class CategoriesModule {}
