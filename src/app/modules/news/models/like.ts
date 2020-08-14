import { User } from '../../../shared/models/user.model';
import { LikeType } from './enums/like-type';

export class Like {
  id: string;
  user: Partial<User>;
  article: string;
  type: LikeType;
  createdAt: Date;
  updatedAt: Date;
}
