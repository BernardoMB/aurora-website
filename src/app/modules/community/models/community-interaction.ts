import { User } from '../../../shared/models/user.model';
import { ReactionType } from './enums/reaction-type';
import { Like } from '../../news/models/like';
import { Review } from '../../../shared/models/review.model';
import { Comment } from '../../news/models/comment';

export class Reaction {
  createdAt: Date;
  user: Partial<User>;
  type: ReactionType;
  data: Comment | Review | Like;
}
