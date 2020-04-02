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
export class MyCoursesResolver implements Resolve<any> {
  /* isAutehnticated: boolean; */

  constructor(
    private coursesService: CoursesService,
    private authService: AuthService,
    private store: Store<AuthState>
  ) {
    /* this.store.pipe(select(selectAuthIsAuthenticated)).subscribe((isAuthenticated: boolean) => {
      if (isAuthenticated) {
        this.isAutehnticated = true;
      } else {
        this.isAutehnticated = false;
      }
    }); */
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.store.pipe(
      select(selectAuthUser),
      take(1),
      mergeMap((user: User) => {
        return this.coursesService.getRecommendedCourses(user.id).pipe(
          map((recommendedCourses: Course[]) => {
            const myCoursesInfo = {
              recommendedCourses
            };
            return myCoursesInfo;
          })
        );
      })
    );
  }
}
