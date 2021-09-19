import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../../../../shared/models/user.model';
import { Course } from '../../../../shared/models/course.model';
import { Store, select } from '@ngrx/store';
import { AuthState } from '../../../../store/auth/auth.state';
import { Router, ActivatedRoute } from '@angular/router';
import { CoursesService } from '../../services/courses.service';
import {
  selectAuthIsAuthenticated,
  selectAuthUser,
} from '../../../../store/auth/auth.selectors';
import { Page } from '../../../../shared/models/page.model';
import { PagedData } from '../../../../shared/models/paged-data.model';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss'],
})
export class WishlistComponent implements OnInit, OnDestroy {
  queryParamsSubscription: Subscription;
  userSubscription: Subscription;
  user: User;

  // User courses pagination
  courses: Course[];
  page = new Page({ size: 10 });

  constructor(
    private store: Store<AuthState>,
    private router: Router,
    private route: ActivatedRoute,
    private coursesService: CoursesService,
  ) {}

  ngOnInit() {
    this.userSubscription = this.store
      .pipe(select(selectAuthUser))
      .subscribe((user: User) => {
        if (user) {
          this.user = user;
          if (this.route.snapshot.queryParams.page) {
            const page = this.route.snapshot.queryParams.page;
            this.setPage({ offset: page });
          } else {
            this.router.navigate(['./'], {
              relativeTo: this.route,
              queryParams: { page: 1 },
            });
          }
          this.queryParamsSubscription = this.route.queryParams.subscribe(
            (queryParams: any) => {
              if (queryParams.page) {
                const page = queryParams.page;
                this.setPage({ offset: page });
              }
            },
          );
        }
      });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
    this.queryParamsSubscription.unsubscribe();
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
    this.coursesService
      .getUserWishlistCoursesPagedData(this.page)
      .subscribe((pagedData: PagedData<Course>) => {
        // console.log(`Page number: ${pagedData.page.pageNumber}; Total pages: ${pagedData.page.totalPages}`);
        this.page = pagedData.page;
        this.courses = pagedData.data.asImmutable().toJS() as Course[];
      });
  }
}
