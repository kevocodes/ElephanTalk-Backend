import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CreatePostDto } from '../dtos/post.dto';
import { Request } from 'express';
import { PostService } from '../services/post.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RequestUser } from 'src/common/models/requestUser.model';

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
}
