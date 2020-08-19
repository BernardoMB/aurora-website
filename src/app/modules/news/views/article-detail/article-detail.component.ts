import { Component, OnInit, OnDestroy } from '@angular/core';
import { Article } from '../../models/article';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Subscription, Observable, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CreateOrUpdateCommentDto } from '../../models/dto/create-or-update-comment.dto';
import { Comment } from '../../models/comment';
import { User } from '../../../../shared/models/user.model';
import { Store, select } from '@ngrx/store';
import { State } from '../../../../store/state';
import { selectAuthUser } from '../../../../store/auth/auth.selectors';
import { NewsService } from '../../services/news.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LoginFormComponent } from '../../../../components/login-form/login-form.component';
import { switchMap, tap } from 'rxjs/operators';
import { SignupFormComponent } from '../../../../components/signup-form/signup-form.component';
import {
  unlikeArticle,
  likeArticle,
  undislikeArticle,
  dislikeArticle,
} from '../../../../store/auth/auth.actions';
@UntilDestroy({ arrayName: 'subscriptions' })
@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.scss'],
})
export class ArticleDetailComponent implements OnInit, OnDestroy {
  article: Article;
  user: User;
  subscriptions: Subscription[] = [];

  get userDislikes() {
    return (
      !!this.user && this.user.dislikedArticles.indexOf(this.article.id) !== -1
    );
  }
  get userLikes() {
    return (
      !!this.user && this.user.likedArticles.indexOf(this.article.id) !== -1
    );
  }
  get isExternal() {
    return !!this.article && this.article.type === 'ExternalArticle';
  }

  constructor(
    private readonly route: ActivatedRoute,
    private readonly store: Store<State>,
    private readonly newsService: NewsService,
    private readonly dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.route.data.subscribe(({ article }: { article: Article }) => {
        this.article = article;
      }),
      this.store.pipe(select(selectAuthUser)).subscribe((user) => {
        this.user = user;
      }),
    );
  }

  ngOnDestroy(): void {}

  onOpenLoginModal() {
    const dialogConfig: MatDialogConfig = {
      autoFocus: true,
      panelClass: 'custom-mat-dialog-container',
      backdropClass: 'custom-modal-backdrop',
      maxHeight: '80vh',
    };
    this.dialog
      .open(LoginFormComponent, dialogConfig)
      .afterClosed()
      .pipe(
        switchMap((result) => {
          if (result.showSignUpModalOnClose) {
            return this.dialog
              .open(SignupFormComponent, dialogConfig)
              .afterClosed();
          }
          return of(undefined);
        }),
        untilDestroyed(this),
      )
      .subscribe(console.log);
  }

  onCommentSubmited(dto: CreateOrUpdateCommentDto): void {
    this.newsService
      .commentOnArticle(this.article.id, dto)
      .pipe(untilDestroyed(this))
      .subscribe((updatedArticle) => {
        this.article = {
          ...this.article,
          comments: [...updatedArticle.comments],
        };
      });
  }

  onOpenUpdateCommentModal(comment: Comment) {
    console.log('Update comment modal', comment);
  }

  onLikeArticle() {
    const operation = this.userLikes
      ? this.newsService.undoLike(this.article.id).pipe(
          tap(() => {
            this.store.dispatch(unlikeArticle({ articleId: this.article.id }));
          }),
        )
      : this.newsService.likeArticle(this.article.id, this.userDislikes).pipe(
          tap(() => {
            this.store.dispatch(likeArticle({ articleId: this.article.id }));
          }),
        );
    this.subscriptions.push(
      operation.subscribe((updatedArticle) => {
        this.article = {
          ...this.article,
          likes: [...updatedArticle.likes],
          dislikes: [...updatedArticle.dislikes],
        };
      }),
    );
  }

  onDislikeArticle() {
    const operation = this.userDislikes
      ? this.newsService.undoDislike(this.article.id).pipe(
          tap(() => {
            this.store.dispatch(
              undislikeArticle({ articleId: this.article.id }),
            );
          }),
        )
      : this.newsService
          .dislikeArticle(this.article.id, this.userDislikes)
          .pipe(
            tap(() => {
              this.store.dispatch(
                dislikeArticle({ articleId: this.article.id }),
              );
            }),
          );
    this.subscriptions.push(
      operation.subscribe((updatedArticle) => {
        this.article = {
          ...this.article,
          likes: [...updatedArticle.likes],
          dislikes: [...updatedArticle.dislikes],
        };
      }),
    );
  }
}
