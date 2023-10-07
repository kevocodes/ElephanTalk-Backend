import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentPostDto, CreatePostDto, UpdatePostDto } from '../dtos/post.dto';
import { Request } from 'express';
import { PostService } from '../services/post.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { RequestUser } from 'src/common/models/requestUser.model';
import { MongoIdPipe } from 'src/common/pipes/mongo/mongo-id.pipe';
import { Types } from 'mongoose';

@UseGuards(JwtAuthGuard)
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  async create(@Body() body: CreatePostDto, @Req() req: Request) {
    const { id } = req.user as RequestUser;

    return {
      data: await this.postService.create(id, body),
    };
  }

  @Get()
  async findAllAvailable() {
    return {
      data: await this.postService.findAllAvailable(),
    };
  }

  @Get('all')
  async findAll() {
    return {
      data: await this.postService.findAll(),
    };
  }

  @Get('owned')
  async findAllOwned(@Req() req: Request) {
    const { id } = req.user as RequestUser;

    return {
      data: await this.postService.findAllOwned(id),
    };
  }

  @Get('favorites')
  async findAllFavorites(@Req() req: Request) {
    const { id } = req.user as RequestUser;

    return {
      data: await this.postService.findAllFavorites(id),
    };
  }

  @Get(':id')
  async findOne(@Param('id', MongoIdPipe) id: Types.ObjectId) {
    return {
      data: await this.postService.findOneById(id),
    };
  }

  @Put(':id')
  async updateOne(
    @Req() req: Request,
    @Param('id', MongoIdPipe) id: Types.ObjectId,
    @Body() body: UpdatePostDto,
  ) {
    const user = req.user as RequestUser;

    return {
      data: await this.postService.updateOneById(id, body, user.id),
    };
  }

  @Delete(':id')
  async deleteOne(
    @Req() req: Request,
    @Param('id', MongoIdPipe) id: Types.ObjectId,
  ) {
    const user = req.user as RequestUser;

    return {
      data: await this.postService.deleteOneById(id, user.id),
    };
  }

  @Patch(':id/active')
  async toggleActive(
    @Req() req: Request,
    @Param('id', MongoIdPipe) id: Types.ObjectId,
  ) {
    const user = req.user as RequestUser;

    return {
      data: await this.postService.toggleActive(id, user.id),
    };
  }

  @Patch(':id/like')
  async toggleLike(
    @Req() req: Request,
    @Param('id', MongoIdPipe) id: Types.ObjectId,
  ) {
    const user = req.user as RequestUser;

    return {
      data: await this.postService.toggleLike(id, user.id),
    };
  }

  @Patch(':id/comment')
  async addComment(
    @Req() req: Request,
    @Param('id', MongoIdPipe) id: Types.ObjectId,
    @Body() comment: CommentPostDto,
  ) {
    const user = req.user as RequestUser;

    return {
      data: await this.postService.addComment(id, user.id, comment),
    };
  }

  @Patch(':id/favorite')
  async toggleFavorite(
    @Req() req: Request,
    @Param('id', MongoIdPipe) id: Types.ObjectId,
  ) {
    const user = req.user as RequestUser;

    return {
      data: await this.postService.toggleFavorite(user.id, id),
    };
  }
}
