import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable, throwError, of } from 'rxjs';
import { Article } from '../models/article';
import { Page } from '../../../shared/models/page.model';
import { PagedData } from '../../../shared/models/paged-data.model';
import { stringifyUrl, parseUrl } from 'query-string';
import { switchMap, map } from 'rxjs/operators';
import { shuffleArray } from '../../../shared/utils';
import { ServerPagedDataDto } from '../../../shared/models/dto/server-paged-data.dto';
import { CreateOrUpdateCommentDto } from '../models/dto/create-or-update-comment.dto';

@Injectable({ providedIn: 'root' })
export class NewsService {
  prefix = 'articles';

  get baseUrl() {
    return `${environment.host}/${environment.apiVersion}/${this.prefix}`;
  }

  constructor(private http: HttpClient) {}

  /**
   * Get an article by id. No pagination required
   *
   * @param {string} articleId
   * @returns {Observable<Article>}
   * @memberof ArticlesService
   */
  getArticle(articleId: string): Observable<Article> {
    console.log(`News service: Getting article with id ${articleId}`);
    return this.http.get<Article>(`${this.baseUrl}/${articleId}`);
    // return this.getFakeArticle(articleId);
  }

  /**
   * Get articles page.
   *
   * @param {Page} page
   * @returns {Observable<PagedData<Event>>}
   * @memberof NewsService
   */
  getArticlesPageData(page: Page): Observable<PagedData<Article>> {
    console.log('News service: Getting articles page');
    // TODO: fix filtering
    const query = {
      ...page.toPaginationParams(),
      // sort: { 'createdAt': 'desc' },
    };
    // return this.getFakeArticles(this.getUrl(query)).pipe(
    return this.http
      .get<ServerPagedDataDto<Article>>(this.getUrl(query))
      .pipe(map((res) => new PagedData<Article>(res, page)));
  }

  /**
   * Get featured articles.
   *
   * @returns {Observable<Article[]>}
   * @memberof NewsService
   */
  getFeaturedArticles(): Observable<Article[]> {
    // TODO: Actually get featured articles.
    console.log('News service: Getting featured articles');
    return this.http.get<ServerPagedDataDto<Article>>(this.getUrl()).pipe(
      map((res) => {
        return res.data.slice(0, 4);
      }),
      // map((res) => new PagedData<Article>(res, page)),
    );
  }

  commentOnArticle(
    articleId: string,
    dto: CreateOrUpdateCommentDto,
  ): Observable<Article> {
    console.log('News service: Commenting on article');
    const url = `${this.baseUrl}/${articleId}/comment`;
    return this.http.post<Article>(url, dto);
  }

  likeArticle(articleId: string, hasDislike = false): Observable<Article> {
    console.log('News service: Like article');
    const url = `${this.baseUrl}/${articleId}/like`;
    const likeArticle = this.http.post<Article>(url, {});
    if (hasDislike) {
      return this.undoLike(articleId).pipe(switchMap(() => likeArticle));
    }
    return likeArticle;
  }

  dislikeArticle(articleId: string, hasLike = false): Observable<Article> {
    console.log('News service: Dislike article');
    const url = `${this.baseUrl}/${articleId}/dislike`;
    const dislikeArticle = this.http.post<Article>(url, {});
    if (hasLike) {
      return this.undoLike(articleId).pipe(switchMap(() => dislikeArticle));
    }
    return dislikeArticle;
  }

  undoLike(articleId: string): Observable<Article> {
    console.log('News service: Undolike article');
    const url = `${this.baseUrl}/${articleId}/undo-like`;
    return this.http.delete<Article>(url);
  }

  undoDislike(articleId: string): Observable<Article> {
    console.log('News service: Undodislike article');
    const url = `${this.baseUrl}/${articleId}/undo-dislike`;
    return this.http.delete<Article>(url);
  }

  /**
   * @param  {any={}} query - the query to be passed to the [query-string library]{@link https://github.com/sindresorhus/query-string#readme}
   * @param  {} subUrlSegment='' - the suburl segment to concatenate to the baseUrl
   */
  private getUrl(q: any = {}, subUrlSegment = '') {
    const query =
      '?' +
      new URLSearchParams({
        sort: '+createdAt',
        ...q,
      }).toString();
    console.log(this.baseUrl + subUrlSegment + query);
    return this.baseUrl + subUrlSegment + query;
    // return stringifyUrl(
    //   { url: this.baseUrl + subUrlSegment, query },
    //   {
    //     skipNull: true,
    //     skipEmptyString: true,
    //   },
    // );
  }

  private getFakeArticles(
    url: string,
    shuffle = false,
  ): Observable<ServerPagedDataDto<Article>> {
    const { query } = parseUrl(url, { arrayFormat: 'comma' });
    console.log(query);
    const { skip, limit } = query;
    return this.http
      .get<Article[]>('/assets/fake-data/fake-articles.json')
      .pipe(
        map((items) => {
          const data = shuffle ? shuffleArray<Article>(items) : items;
          console.log(data);
          const count = data.length;
          if (typeof skip !== 'undefined' || typeof limit !== 'undefined') {
            return {
              count,
              data: data.slice(Number(skip), Number(skip) + Number(limit)),
            };
          }
          return {
            count,
            data,
          };
        }),
      );
  }

  private getFakeArticle(id: string): Observable<Article> {
    console.log(id);
    return this.http
      .get<Article[]>('/assets/fake-data/fake-articles.json')
      .pipe(
        switchMap((items) => {
          const index = items.findIndex((i) => i.id === id);
          if (index === -1) {
            return throwError(new Error('Article not found!'));
          }
          return of(items[index]);
        }),
      );
  }
}
