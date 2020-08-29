import { Like } from './like';
import { Comment } from './comment';
import { ArticleType } from './enums/article-type';
export class Article {
  comments: Comment[];
  likes: Like[];
  dislikes: Like[];
  title: string;
  subtitle: string;
  description: string;
  externalUrl?: string;
  type: ArticleType;
  data: string;
  readTime: string;
  imgUrl: string;
  createdAt: Date;
  updatedAt: Date;
  id: string;
}
