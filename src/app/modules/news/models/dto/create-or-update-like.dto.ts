import { LikeType } from '../enums/like-type';
import { Like } from '../like';

export class CreateOrUpdateLikeDto implements Partial<Like> {
  type: LikeType;
}
