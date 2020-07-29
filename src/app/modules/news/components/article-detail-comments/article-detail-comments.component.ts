import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-article-detail-comments',
  templateUrl: './article-detail-comments.component.html',
  styleUrls: ['./article-detail-comments.component.scss'],
})
export class ArticleDetailCommentsComponent implements OnInit {
  // TODO: add typings
  @Input() comments: any = [];
  constructor() {}

  ngOnInit(): void {}
}
