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
import { ArticleDetailCommentsComponent } from './components/article-detail-comments/article-detail-comments.component';
import { CommentCardComponent } from './components/comment-card/comment-card.component';
import { CommentFormComponent } from './components/comment-form/comment-form.component';
import { ArticleCommentsComponent } from './components/article-comments/article-comments.component';
import { UpdateCommentModalComponent } from './components/update-comment-modal/update-comment-modal.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    NewsComponent,
    ArticleCardComponent,
    ArticleDetailComponent,
    ArticleDetailCommentsComponent,
    CommentCardComponent,
    CommentFormComponent,
    ArticleCommentsComponent,
    UpdateCommentModalComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    ScrollingModule,
    NgxPaginationModule,
    NewsRoutingModule,
  ],
  providers: [ArticleDetailResolver],
})
export class NewsModule {}
