import { User } from '../../../shared/models/user.model';

export class Comment {
  id: string;
  user: Partial<User>;
  article: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}
