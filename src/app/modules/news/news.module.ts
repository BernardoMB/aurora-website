import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewsRoutingModule } from './news-routing.module';
import { NewsComponent } from './news/news.component';
import { ArticleCardComponent } from './components/article-card/article-card.component';
import { ArticleDetailComponent } from './views/article-detail/article-detail.component';
import { SharedModule } from '../../shared/shared.module';
import { MaterialModule } from '../../material.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgxPaginationModule } from 'ngx-pagination';
import { ArticleDetailResolver } from './resolvers/article-detail.resolver';

@NgModule({
  declarations: [NewsComponent, ArticleCardComponent, ArticleDetailComponent],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    ScrollingModule,
    NgxPaginationModule,
    NewsRoutingModule,
  ],
  providers: [ArticleDetailResolver],
})
export class NewsModule {}
