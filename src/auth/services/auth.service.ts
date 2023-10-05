import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/services/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

  async validateUser(usernameOrEmail: string, password: string) {
    const user = await this.userService.findOneByUsernameOrEmail(
      usernameOrEmail,
    );

    if (!user) {
      return null;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return null;
    }

    const { password: userPassword, ...result } = user.toJSON();

    return result;
  }
}
