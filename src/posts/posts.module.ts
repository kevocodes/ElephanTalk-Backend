import { Module } from '@nestjs/common';
import { PostController } from './controllers/posts.controller';
import { PostService } from './services/posts.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './schemas/post.schema';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    UsersModule,
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
