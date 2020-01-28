import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.scss'],
})
export class ArticleCardComponent implements OnInit {
  @Input() article;

  get day() {
    const updatedAt = new Date(this.article.updatedAt);
    const day = updatedAt.toString().split(' ')[2];
    return day;
  }

  get month() {
    const updatedAt = new Date(this.article.updatedAt);
    const month = updatedAt.toString().split(' ')[1];
    return month;
  }

  constructor() {}

  ngOnInit() {}
}
