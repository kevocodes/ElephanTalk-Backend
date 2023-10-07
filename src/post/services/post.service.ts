import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from '../schemas/post.schema';
import { CommentPostDto, CreatePostDto, UpdatePostDto } from '../dtos/post.dto';
import { Model, Types } from 'mongoose';
import { Comment } from '../models/comment.model';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    private readonly usersService: UsersService,
  ) {}

  create(id: Types.ObjectId, data: CreatePostDto) {
    const newPost = new this.postModel({ ...data, user: id });
    return newPost.save();
  }

  findAll() {
    return this.postModel.find();
  }

  findAllAvailable() {
    return this.postModel.find({ active: true });
  }

  findAllOwned(userId: Types.ObjectId) {
    return this.postModel.find({ user: userId });
  }

  async findAllFavorites(userId: Types.ObjectId) {
    const user = await this.usersService.findOneById(userId);

    return this.postModel.find({ _id: { $in: user.favorites } });
  }

  async findOneById(id: Types.ObjectId) {
    const post = await this.postModel.findOne({ _id: id }).populate('user');

    if (!post) {
      throw new NotFoundException('Post not found.');
    }

    return post;
  }

  async updateOneById(
    id: Types.ObjectId,
    changes: UpdatePostDto,
    userId: Types.ObjectId,
  ) {
    const post = await this.findOneById(id);

    if (!post.user._id.equals(userId)) {
      throw new UnauthorizedException('Unauthorized to update this post.');
    }

    const updatedPost = this.postModel.findByIdAndUpdate(
      id,
      { $set: changes },
      { new: true },
    );

    return updatedPost;
  }

  async deleteOneById(id: Types.ObjectId, userId: Types.ObjectId) {
    const post = await this.findOneById(id);

    if (!post.user._id.equals(userId)) {
      throw new UnauthorizedException('Unauthorized to delete this post.');
    }

    return this.postModel.deleteOne({ _id: id });
  }

  async toggleActive(id: Types.ObjectId, userId: Types.ObjectId) {
    const post = await this.findOneById(id);

    if (!post.user._id.equals(userId)) {
      throw new UnauthorizedException('Unauthorized to update this post.');
    }

    return this.postModel.findByIdAndUpdate(
      id,
      { $set: { active: !post.active } },
      { new: true },
    );
  }

  async toggleLike(id: Types.ObjectId, userId: Types.ObjectId) {
    const post = await this.findOneById(id);

    let { likes } = post;

    const isLiked = likes.includes(userId);

    if (isLiked) {
      likes = likes.filter((id) => !id.equals(userId));
    } else {
      likes.push(userId);
    }

    return this.postModel
      .findByIdAndUpdate(id, { $set: { likes } }, { new: true })
      .populate('user');
  }

  async addComment(
    id: Types.ObjectId,
    userId: Types.ObjectId,
    comment: CommentPostDto,
  ) {
    await this.findOneById(id);

    const newComment: Comment = {
      content: comment.content,
      user: userId,
      createdAt: new Date(),
    };

    return this.postModel.findByIdAndUpdate(
      id,
      { $push: { comments: newComment } },
      { new: true },
    );
  }

  async toggleFavorite(userId: Types.ObjectId, postId: Types.ObjectId) {
    await this.findOneById(postId);

    return this.usersService.toggleFavoritePost(userId, postId);
  }
}
