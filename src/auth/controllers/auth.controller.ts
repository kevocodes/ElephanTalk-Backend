import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import { CreateUserDto } from 'src/users/dtos/user.dto';
import { UsersService } from 'src/users/services/users.service';
import { AuthInfoDto } from '../dto/auth.dto';
import { loginExamples } from '../swagger/examples';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private userService: UsersService) {}

  /**
   * Login with username or email
   */
  @ApiBody({ type: AuthInfoDto, examples: loginExamples })
  @ApiCreatedResponse({ description: 'User logged in' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Req() req: Request) {
    return req.user;
  }

  /**
   * Register a new user
   */
  @ApiCreatedResponse({ description: 'User registered' })
  @ApiBadRequestResponse({
    description: 'Email or username already exists - Invalid create data',
  })
  @Post('register')
  async register(@Body() payload: CreateUserDto) {
    return {
      data: await this.userService.create(payload),
    };
  }
}
