import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, trim: true })
  username: string;

  @Prop({ required: true, unique: true, trim: true, lowercase: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ type: [Types.ObjectId], ref: 'Post', default: [] })
  favorites: Types.ObjectId[];

  static getModelName(): string {
    return this.name;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
