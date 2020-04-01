import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, pipe, forkJoin } from 'rxjs';
import { Injectable } from '@angular/core';
import { CoursesService } from '../services/courses.service';
import { mergeMap, map, take } from 'rxjs/operators';
import { Course } from '../../../shared/models/course.model';
import { AuthService } from '../../../services/auth.service';
import { User, IPurchasedCourse } from '../../../shared/models/user.model';
import { Store, select } from '@ngrx/store';
import { AuthState } from '../../../store/auth/auth.state';
import { selectAuthIsAuthenticated, selectAuthUser } from '../../../store/auth/auth.selectors';
import { Page, PagedData } from '../../../shared/utils';

@Injectable()
export class LearnResolver implements Resolve<any> {
  isAutehnticated: boolean;

  constructor(
    private coursesService: CoursesService,
    private authService: AuthService,
    private store: Store<AuthState>
  ) {
    this.store.pipe(select(selectAuthIsAuthenticated)).subscribe((isAuthenticated: boolean) => {
      if (isAuthenticated) {
        this.isAutehnticated = true;
      } else {
        this.isAutehnticated = false;
      }
    });
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.coursesService.getCourse(route.params.id).pipe(
      mergeMap((course: Course) => {
        const page = new Page();
        page.pageNumber = 1;
        page.size = 5;
        return this.coursesService.getCategoryCoursesPageData(page, course.category.id).pipe(
          mergeMap((relatedCoursesPage: PagedData<Course>) => {
            if (this.isAutehnticated) {
              // Get the user progress from auth state
              return this.store.pipe(
                select(selectAuthUser),
                take(1),
                map((user: User) => {
                  const userProgress = user.purchasedCourses.filter((el: IPurchasedCourse) => el.course === course.id)[0].progress;
                  const learningInfo = {
                    course,
                    userProgress,
                    relatedCourses: relatedCoursesPage.data
                  };
                  return learningInfo;
                })
              );
            } else {
              // Get the user progress from the server
              return this.authService.getUserInfo().pipe(
                map((user: User) => {
                  const userProgress = user.purchasedCourses.filter((el: IPurchasedCourse) => el.course === course.id)[0].progress;
                  const learningInfo = {
                    course,
                    userProgress,
                    relatedCourses: relatedCoursesPage.data
                  };
                  return learningInfo;
                })
              );
            }
          })
        );
      })
    );
  }
}
