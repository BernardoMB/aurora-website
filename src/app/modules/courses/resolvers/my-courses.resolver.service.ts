import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { CoursesService } from '../services/courses.service';
import { mergeMap, map, take } from 'rxjs/operators';
import { Course } from '../../../shared/models/course.model';
import { User } from '../../../shared/models/user.model';
import { Store, select } from '@ngrx/store';
import { AuthState } from '../../../store/auth/auth.state';
import { selectAuthUser } from '../../../store/auth/auth.selectors';
import { AuthService } from '../../../services/auth.service';

@Injectable()
export class MyCoursesResolver implements Resolve<any> {
  constructor(
    private coursesService: CoursesService,
    private store: Store<AuthState>,
    private router: Router,
    private authServie: AuthService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.authServie.getUserInfo().pipe(
      mergeMap((user: User) => {
        if (user) {
          return this.coursesService.getRecommendedCourses(user.id).pipe(
            map((recommendedCourses: Course[]) => {
              const myCoursesInfo = {
                recommendedCourses
              };
              return myCoursesInfo;
            })
          );
        }
      })
    );
  }
}
