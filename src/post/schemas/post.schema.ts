import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
import { Comment } from '../models/comment.model';

export type PostDocument = HydratedDocument<Post>;

@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ required: true, trim: true })
  image: string;

  @Prop({ default: true })
  active: boolean;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: User.name, default: [] })
  likes: Types.ObjectId[];

  @Prop({ default: [] })
  comments: Comment[];
}

export const PostSchema = SchemaFactory.createForClass(Post);
