import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Comment } from '../models/comment.model';

export type PostDocument = HydratedDocument<Post>;

@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ required: true, trim: true })
  image: string;

  @Prop({ default: true })
  active: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  likes: Types.ObjectId[];

  @Prop({
    type: [
      {
        content: {
          type: String,
          required: true,
          trim: true,
        },
        user: { type: Types.ObjectId, ref: 'User', required: true },
        createdAt: Date,
      },
    ],
    default: [],
  })
  comments: Comment[];
}

export const PostSchema = SchemaFactory.createForClass(Post);
