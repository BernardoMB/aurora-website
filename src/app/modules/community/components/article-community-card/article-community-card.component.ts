import { Component, OnInit, Input } from '@angular/core';
import { Article } from '../../../news/models/article';
import { Reaction } from '../../models/community-interaction';

@Component({
  selector: 'app-article-community-card',
  templateUrl: './article-community-card.component.html',
  styleUrls: ['./article-community-card.component.scss'],
})
export class ArticleCommunityCardComponent implements OnInit {
  @Input() set reaction(val: Reaction) {
    this.article = ((val.data as any).article as unknown) as Article;
  }
  article: Article;
  constructor() {}

  ngOnInit(): void {}
}
