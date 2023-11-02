import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from '../schemas/post.schema';
import { CommentPostDto, CreatePostDto, UpdatePostDto } from '../dtos/post.dto';
import { FilterQuery, Model, Types } from 'mongoose';
import { Comment } from '../models/comment.model';
import { UsersService } from 'src/users/services/users.service';
import { PaginationParamsDto } from 'src/common/dtos/paginationParams.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    private readonly usersService: UsersService,
  ) {}

  async create(id: Types.ObjectId, data: CreatePostDto) {
    const newPost = new this.postModel({ ...data, user: id });
    return await newPost.save();
  }

  async findAll(
    paginationParams: PaginationParamsDto,
    query: FilterQuery<Post> = {},
  ) {
    const { limit = 20, page = 1 } = paginationParams;

    const skip = limit * (page - 1);
    const count = await this.postModel.count(query);
    const pages = Math.ceil(count / limit);

    const posts = await this.postModel
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }) // sort by createdAt in descending order
      .populate('user', 'username picture') // select username, and picture field
      .populate('likes', 'username picture') // select username, and picture field
      .populate({ path: 'comments.user', select: 'username picture' }) // select username, and picture field
      .select('-comments._id'); // exclude _id field from comments

    return {
      data: posts,
      pagination: {
        count,
        page,
        pages,
        limit,
      },
    };
  }

  async findAllFavorites(
    userId: Types.ObjectId,
    paginationParams: PaginationParamsDto,
  ) {
    const user = await this.usersService.findOneById(userId);

    const { limit = 20, page = 1 } = paginationParams;

    const skip = limit * (page - 1);
    const count = await this.postModel.count({ _id: { $in: user.favorites } });
    const pages = Math.ceil(count / limit);

    const posts = await this.postModel
      .find({ _id: { $in: user.favorites }, active: true })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }) // sort by createdAt in descending order
      .populate('user', 'username picture') // select username, and picture field
      .populate('likes', 'username picture') // select username, and picture field
      .populate({ path: 'comments.user', select: 'username picture' }) // select username, and picture field
      .select('-comments._id'); // exclude _id field from comments

    return {
      data: posts,
      pagination: {
        count,
        page,
        pages,
        limit,
      },
    };
  }

  async findOneById(id: Types.ObjectId, userId: Types.ObjectId) {
    const post = await this.postModel
      .findOne({ _id: id })
      .populate('user', 'username picture') // select username, and picture field
      .populate('likes', 'username picture') // select username, and picture field
      .populate({ path: 'comments.user', select: 'username picture' }) // select username, and picture field
      .select('-comments._id'); // exclude _id field from comments;

    if (!post) {
      throw new NotFoundException('Post not found.');
    }

    if (!post.active && !post.user._id.equals(userId)) {
      throw new NotFoundException('Post not found.');
    }

    return post;
  }

  async updateOneById(
    id: Types.ObjectId,
    changes: UpdatePostDto,
    userId: Types.ObjectId,
  ) {
    const post = await this.findOneById(id, userId);

    if (!post.user._id.equals(userId)) {
      throw new ForbiddenException('Forbidden to update this post.');
    }

    const updatedPost = this.postModel
      .findByIdAndUpdate(id, { $set: changes }, { new: true })
      .select('title description image updatedAt -_id');

    return updatedPost;
  }

  async deleteOneById(id: Types.ObjectId, userId: Types.ObjectId) {
    const post = await this.findOneById(id, userId);

    if (!post.user._id.equals(userId)) {
      throw new ForbiddenException('Forbidden to delete this post.');
    }

    return this.postModel.deleteOne({ _id: id });
  }

  async toggleActive(id: Types.ObjectId, userId: Types.ObjectId) {
    const post = await this.findOneById(id, userId);

    if (!post.user._id.equals(userId)) {
      throw new ForbiddenException('Forbidden to update this post.');
    }

    return this.postModel
      .findByIdAndUpdate(id, { $set: { active: !post.active } }, { new: true })
      .select('active -_id');
  }

  async toggleLike(id: Types.ObjectId, userId: Types.ObjectId) {
    const post = await this.postModel.findById(id);

    if (!post) {
      throw new NotFoundException('Post not found.');
    }

    let { likes } = post;

    const isLiked = likes.includes(userId);

    if (isLiked) {
      likes = likes.filter((id) => !id.equals(userId));
    } else {
      likes.push(userId);
    }

    return this.postModel
      .findByIdAndUpdate(id, { $set: { likes } }, { new: true })
      .select('likes -_id');
  }

  async addComment(
    id: Types.ObjectId,
    userId: Types.ObjectId,
    comment: CommentPostDto,
  ) {
    await this.findOneById(id, userId);

    const newComment: Comment = {
      content: comment.content,
      user: userId,
      createdAt: new Date(),
    };

    return this.postModel
      .findByIdAndUpdate(id, { $push: { comments: newComment } }, { new: true })
      .select('comments -_id');
  }

  async toggleFavorite(userId: Types.ObjectId, postId: Types.ObjectId) {
    await this.findOneById(postId, userId);

    return this.usersService.toggleFavoritePost(userId, postId);
  }
}
