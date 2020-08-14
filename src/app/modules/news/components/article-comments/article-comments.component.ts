import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../../../../shared/models/user.model';
import { Comment } from '../../models/comment';
import { CreateOrUpdateCommentDto } from '../../models/dto/create-or-update-comment.dto';

@Component({
  selector: 'app-article-comments',
  templateUrl: './article-comments.component.html',
  styleUrls: ['./article-comments.component.scss'],
})
export class ArticleCommentsComponent implements OnInit {
  @Input() user: User;
  @Input() comments: Comment[] = [];
  @Output() commentSubmited = new EventEmitter<CreateOrUpdateCommentDto>();
  @Output() openLoginModal = new EventEmitter<void>();
  @Output() openUpdateCommentModal = new EventEmitter<Comment>();
  constructor() {}

  ngOnInit(): void {}
}
