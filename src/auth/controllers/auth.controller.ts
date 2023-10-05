import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { CreateUserDto } from 'src/users/dtos/user.dto';
import { UsersService } from 'src/users/services/users.service';

@Controller('auth')
export class AuthController {
  constructor(private userService: UsersService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Req() req: Request) {
    return {
      data: req.user,
    };
  }

  @Post('register')
  async register(@Body() payload: CreateUserDto) {
    return {
      data: await this.userService.create(payload),
    };
  }
}
