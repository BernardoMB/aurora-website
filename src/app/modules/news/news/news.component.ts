import { Component, OnInit, OnDestroy } from '@angular/core';
import { PagedData } from '../../../shared/models/paged-data.model';
import { Subscription } from 'rxjs';
import { Page } from '../../../shared/models/page.model';
import { NewsService } from '../services/news.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Article } from '../models/article';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
})
export class NewsComponent implements OnInit, OnDestroy {
  routerSubscription: Subscription;
  articles: Article[] = [];
  featuredArticles: Article[] = [];

  // Courses pagination
  page = new Page();

  constructor(
    private newsService: NewsService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.routerSubscription = this.router.events
      .pipe(
        filter((event) => {
          return event instanceof NavigationEnd;
        }),
      )
      .subscribe(() => {
        if (this.route.snapshot.queryParams.page) {
          const pageNumber = this.route.snapshot.queryParams.page;
          let size = 1 * 4;
          const vw = window.innerWidth; // Viewport with
          if (500 < vw && vw <= 684) {
            size = 2 * 4;
          } else if (684 < vw && vw <= 888) {
            size = 3 * 4;
          } else {
            size = 4 * 4;
          }
          this.page = this.page.copyWith({ size });
          this.setPage({ offset: pageNumber });
        } else {
          this.router.navigate(['./'], {
            relativeTo: this.route,
            queryParams: { page: 1 },
          });
        }
      });
  }

  ngOnInit() {
    this.newsService.getFeaturedArticles().subscribe((res) => {
      this.featuredArticles = res;
    });
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }

  pageChanged(pageNumber: number) {
    this.page = this.page.copyWith({ pageNumber });
    this.router.navigate(['./'], {
      relativeTo: this.route,
      queryParams: { page: pageNumber },
    });
  }

  /**
   * Paging function
   * @param pageInfo The page to select
   */
  setPage(pageInfo: { offset: number }) {
    this.page = this.page.copyWith({ pageNumber: pageInfo.offset });
    this.newsService
      .getArticlesPageData(this.page)
      .subscribe((pagedData: PagedData<Article>) => {
        this.page = pagedData.page;
        this.articles = pagedData.data.toJS();
      });
  }
}
