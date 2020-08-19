import { Component, OnInit, Input } from '@angular/core';
import { Reaction } from '../../models/community-interaction';
import { ReactionType } from '../../models/enums/reaction-type';

@Component({
  selector: 'app-community-card',
  templateUrl: './community-card.component.html',
  styleUrls: ['./community-card.component.scss'],
})
export class CommunityCardComponent implements OnInit {
  @Input() reaction: Reaction;

  get title(): string {
    switch (this.reaction.type) {
      case ReactionType.Comment:
        return `${this.reaction.user.username} commented on an article.`;
      case ReactionType.Dislike:
        return `${this.reaction.user.username} disliked an article.`;
      case ReactionType.Like:
        return `${this.reaction.user.username} liked an article.`;
      case ReactionType.Review:
        return `${this.reaction.user.username} reviewed a course.`;
      default:
        return `${this.reaction.user.username} interacted.`;
    }
  }

  get icon(): string {
    switch (this.reaction.type) {
      case ReactionType.Comment:
        return 'question_answer';
      case ReactionType.Dislike:
        return 'thumb_down';
      case ReactionType.Like:
        return 'thumb_up';
      case ReactionType.Review:
        return 'stars';
      default:
        return 'receipt';
    }
  }

  reactionTypes = ReactionType;

  constructor() {}

  ngOnInit(): void {}
}
