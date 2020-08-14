import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../../../../shared/models/user.model';
import { CreateOrUpdateCommentDto } from '../../models/dto/create-or-update-comment.dto';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.scss'],
})
export class CommentFormComponent implements OnInit {
  @Input() maxLength = 700;
  @Input() user: User;
  @Output() commentSubmitted = new EventEmitter<CreateOrUpdateCommentDto>();

  commentForm = new FormGroup({
    text: new FormControl('', [
      Validators.required,
      Validators.maxLength(this.maxLength),
    ]),
  });

  constructor() {}

  ngOnInit(): void {}

  onSubmit() {
    if (!this.commentForm.valid) {
      return;
    }
    this.commentSubmitted.next(this.commentForm.value);
    this.commentForm.reset();
  }
}
