import { Types } from 'mongoose';

export class Comment {
  content: string;
  user: Types.ObjectId;
  createdAt: Date;
}
