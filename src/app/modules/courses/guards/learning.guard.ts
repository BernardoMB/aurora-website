import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthState } from '../../../store/auth/auth.state';
import { Store, select } from '@ngrx/store';
import { selectAuthIsAuthenticated, selectAuthUser } from '../../../store/auth/auth.selectors';
import { CookieService } from 'ngx-cookie-service';
import { User } from '../../../shared/models/user.model';
import { map } from 'rxjs/operators';
import { AuthService } from '../../../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LearningGuard implements CanActivate {
  isAutehnticated: boolean;

  constructor(
    private store: Store<AuthState>,
    private router: Router,
    private cookieService: CookieService,
    private authService: AuthService
  ) {
    this.store.pipe(select(selectAuthIsAuthenticated)).subscribe((isAuthenticated: boolean) => {
      if (isAuthenticated) {
        this.isAutehnticated = true;
      } else {
        this.isAutehnticated = false;
      }
    });
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const courseId = next.url[0].path;
    if (this.isAutehnticated) {
      return this.store.pipe(
        select(selectAuthUser),
        map((user: User) => {
          if (user) {
            let index = 0;
            let found = false;
            while (index < user.purchasedCourses.length && !found) {
              if (user.purchasedCourses[index].course === courseId) {
                  found = true;
              }
              index++;
            }
            if (found) {
              return true;
            } else {
              console.log(`LearningGuard: User found in state does not own course with id ${courseId}. Redirecting to /courses`);
              this.router.navigate(['/courses']);
              return false;
            }
          }
        })
      );
    }
    // const userToken = this.cookieService.get('userToken');
    const userToken = localStorage.getItem('userToken');
    if (userToken) {
      return this.authService.checkCourseAccess(courseId).pipe(
        map((res: { canAccess: boolean }) => {
          return res.canAccess;
        })
      );
    }
    console.log(`LearningGuard: No user or token found. Redirecting to /courses`);
    this.router.navigate(['/courses']);
    return false;
  }

}
