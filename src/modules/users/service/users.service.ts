import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from '../repository/users.repository';

import { UpdateUserDto } from '../dto/update-user.dto';
import { DeleteUserDto } from '../dto/delete-user.dto';

import { ResponseUser } from '@/common/filters/response-user';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findOne(id: string) {
    const user = await this.usersRepository.findById(id);
    if (!user) throw new NotFoundException('Usuário não encontrado');

    return { user: ResponseUser.from(user) };
  }

  async update(id: string, { password, ...data }: UpdateUserDto) {
    const user = await this.usersRepository.findById(id);
    if (!user) throw new NotFoundException('Usuário não encontrado');

    const updatedUser = await this.usersRepository.update({
      id: user.id,
      ...data,
      ...(password && { password: await bcrypt.hash(password, 10) }),
    });

    return {
      user: ResponseUser.from(updatedUser),
      message: 'Dados atualizados com sucesso',
    };
  }

  async remove(id: string, { password }: DeleteUserDto) {
    const user = await this.usersRepository.findById(id);
    if (!user) throw new NotFoundException('Usuário não encontrado');

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new UnauthorizedException('Senha incorreta');

    await this.usersRepository.remove(user.id);

    return { message: 'Conta excluída com sucesso' };
  }
}
