import { type IRepository } from '@/common/interfaces/repositories.interface';

import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

export interface IUsersRepository extends IRepository<
  User,
  CreateUserDto,
  UpdateUserDto
> {
  findByEmail(email: string): Promise<User | null>;
}
