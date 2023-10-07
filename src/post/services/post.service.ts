import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from '../schemas/post.schema';
import { CreatePostDto } from '../dtos/post.dto';
import { Model } from 'mongoose';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
  ) {}

  create(id: string, data: CreatePostDto) {
    const newPost = new this.postModel({ ...data, user: id });
    return newPost.save();
  }

  findAllAvailable() {
    return this.postModel.find({ active: true });
  }
}
