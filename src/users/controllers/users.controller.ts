import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from '../dtos/user.dto';
import { UsersService } from '../services/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  create(@Body() payload: CreateUserDto) {
    return this.userService.create(payload);
  }

  @Get()
  async findAll() {
    const users = await this.userService.findAll();
    return {
      data: users,
    };
  }
}
