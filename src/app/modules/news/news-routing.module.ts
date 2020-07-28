import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewsComponent } from './news/news.component';
import { ArticleDetailComponent } from './views/article-detail/article-detail.component';
import { ArticleDetailResolver } from './resolvers/article-detail.resolver';

const routes: Routes = [
  { path: '', component: NewsComponent },

  {
    path: ':id',
    resolve: { article: ArticleDetailResolver },
    component: ArticleDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewsRoutingModule {}
