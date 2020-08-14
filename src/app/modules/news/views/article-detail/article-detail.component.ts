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
import { switchMap } from 'rxjs/operators';
import { SignupFormComponent } from '../../../../components/signup-form/signup-form.component';
@UntilDestroy({ arrayName: 'subscriptions' })
@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.scss'],
})
export class ArticleDetailComponent implements OnInit, OnDestroy {
  article: Article;
  subscriptions: Subscription[] = [];
  user$: Observable<User>;

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
        console.log(this.article);
      }),
    );
    this.user$ = this.store.pipe(select(selectAuthUser));
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
        this.article = updatedArticle;
      });
  }

  onOpenUpdateCommentModal(comment: Comment) {
    console.log('Update comment modal', comment);
  }
}
