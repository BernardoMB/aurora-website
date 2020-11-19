import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { CoursesService } from '../services/courses.service';
import { mergeMap, map } from 'rxjs/operators';
import { Course } from '../../../shared/models/course.model';
import { AuthService } from '../../../services/auth.service';
import { Store, select } from '@ngrx/store';
import { AuthState } from '../../../store/auth/auth.state';
import { selectAuthIsAuthenticated } from '../../../store/auth/auth.selectors';
import { PagedData } from '../../../shared/models/paged-data.model';
import { Page } from '../../../shared/models/page.model';

/**
 * This resolver resolves the course and the related courses to course detail view.
 *
 * @export
 */
@Injectable()
export class CourseDetailResolver implements Resolve<any> {
  isAutehnticated: boolean;

  constructor(
    private coursesService: CoursesService,
    private authService: AuthService,
    private store: Store<AuthState>,
  ) {
    this.store
      .pipe(select(selectAuthIsAuthenticated))
      .subscribe((isAuthenticated: boolean) => {
        if (isAuthenticated) {
          this.isAutehnticated = true;
        } else {
          this.isAutehnticated = false;
        }
      });
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<any> | Promise<any> | any {
    // console.log('Runing resolver');
    return this.coursesService.getCourse(route.params.id).pipe(
      mergeMap((course: Course) => {
        const page = new Page({ pageNumber: 1, size: 5 });
        return this.coursesService
          .getCategoryCoursesPageData(page, course.category.id)
          .pipe(
            map((relatedCoursesPage: PagedData<Course>) => {
              const courseDetailInfo = {
                course,
                relatedCourses: relatedCoursesPage.data.asImmutable().toJS(),
              };
              return courseDetailInfo;
            }),
          );
      }),
    );
  }
}
