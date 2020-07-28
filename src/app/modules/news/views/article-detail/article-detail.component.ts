import { Component, OnInit, OnDestroy } from '@angular/core';
import { Article } from '../../models/article';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.scss'],
})
export class ArticleDetailComponent implements OnInit, OnDestroy {
  article: Article;
  sub: Subscription;

  constructor(private readonly route: ActivatedRoute) {}

  ngOnInit(): void {
    this.sub = this.route.data.subscribe(
      ({ article }: { article: Article }) => {
        this.article = article;
      },
    );
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
