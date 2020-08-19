import { Comment } from '../comment';

export class CreateOrUpdateCommentDto implements Partial<Comment> {
  text: string;
}
