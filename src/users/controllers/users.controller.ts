import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { MongoIdPipe } from 'src/common/pipes/mongo/mongo-id.pipe';
import { UpdateUserDto, UpdateUserRoleDto } from '../dtos/user.dto';
import { Types } from 'mongoose';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/models/roles.model';
import { Request } from 'express';
import { RequestUser } from 'src/common/models/requestUser.model';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @Roles(Role.ADMIN)
  async findAll() {
    const users = await this.userService.findAll();
    return {
      data: users,
    };
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  async findOne(@Param('id', MongoIdPipe) id: Types.ObjectId) {
    return {
      data: await this.userService.findOneById(id),
    };
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  async deleteOne(@Param('id', MongoIdPipe) id: Types.ObjectId) {
    return {
      data: await this.userService.deleteOneById(id),
    };
  }

  @Put(':id')
  async updateOne(
    @Param('id', MongoIdPipe) id: Types.ObjectId,
    @Body() body: UpdateUserDto,
    @Req() req: Request,
  ) {
    const user = req.user as RequestUser;

    return {
      data: await this.userService.updateOneById(id, body, user),
    };
  }

  @Patch(':id/role')
  @Roles(Role.ADMIN)
  async updateRole(
    @Param('id', MongoIdPipe) id: Types.ObjectId,
    @Body() data: UpdateUserRoleDto,
  ) {
    return {
      data: await this.userService.updateRole(id, data.role),
    };
  }
}
