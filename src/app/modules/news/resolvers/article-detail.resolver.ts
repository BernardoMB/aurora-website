import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Article } from '../models/article';
import { NewsService } from '../services/news.service';

@Injectable()
export class ArticleDetailResolver implements Resolve<Article> {
  constructor(private readonly newsService: NewsService) {}
  resolve(
    route: ActivatedRouteSnapshot,
  ): Observable<Article> | Promise<Article> | Article {
    return this.newsService.getArticle(route.params.id);
  }
}
