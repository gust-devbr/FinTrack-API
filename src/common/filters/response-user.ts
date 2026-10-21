import { User } from '@/modules/users/entities/user.entity';

export class ResponseUser {
  static from(user: User) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
