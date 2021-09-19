import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../../../shared/models/user.model';
import { Subscription } from 'rxjs';
import { AuthState } from '../../../../store/auth/auth.state';
import { Store, select } from '@ngrx/store';
import { Router, ActivatedRoute } from '@angular/router';
import { selectAuthUser } from '../../../../store/auth/auth.selectors';
import { Course } from '../../../../shared/models/course.model';
import { CoursesService } from '../../services/courses.service';
import { Page } from '../../../../shared/models/page.model';
import { PagedData } from '../../../../shared/models/paged-data.model';

@Component({
  selector: 'app-all-my-courses',
  templateUrl: './all-my-courses.component.html',
  styleUrls: ['./all-my-courses.component.scss'],
})
export class AllMyCoursesComponent implements OnInit, OnDestroy {
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
            const pageNumber = this.route.snapshot.queryParams.page;
            this.setPage({ offset: pageNumber });
          } else {
            this.router.navigate(['./'], {
              relativeTo: this.route,
              queryParams: { page: 1 },
            });
          }
        }
      });
    this.queryParamsSubscription = this.route.queryParams.subscribe(
      (queryParams: any) => {
        if (queryParams.page) {
          const pageNumber = queryParams.page;
          this.setPage({ offset: pageNumber });
        }
      },
    );
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
    this.queryParamsSubscription.unsubscribe();
  }

  pageChanged(pageNumber: number) {
    this.page = this.page.copyWith({ pageNumber: pageNumber });
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
      .getUserCoursesPagedData(this.page)
      .subscribe((pagedData: PagedData<Course>) => {
        console.log(
          `Page number: ${pagedData.page.pageNumber}; Total pages: ${pagedData.page.totalPages}`,
        );
        this.page = pagedData.page;
        this.courses = pagedData.data.asImmutable().toJS() as Course[];
      });
  }
}
