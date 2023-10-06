import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { MongoIdPipe } from 'src/common/pipes/mongo/mongo-id.pipe';
import { UpdateUserDto } from '../dtos/user.dto';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async findAll() {
    const users = await this.userService.findAll();
    return {
      data: users,
    };
  }

  @Get(':id')
  async findOne(@Param('id', MongoIdPipe) id: string) {
    return {
      data: await this.userService.findOneById(id),
    };
  }

  @Delete(':id')
  async deleteOne(@Param('id', MongoIdPipe) id: string) {
    return {
      data: await this.userService.deleteOneById(id),
    };
  }

  @Put(':id')
  async updateOne(
    @Param('id', MongoIdPipe) id: string,
    @Body() body: UpdateUserDto,
  ) {
    return {
      data: await this.userService.updateOneById(id, body),
    };
  }
}
