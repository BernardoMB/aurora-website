import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthState } from '../../../store/auth/auth.state';
import { Store, select } from '@ngrx/store';
import { selectAuthIsAuthenticated, selectAuthUser } from '../../../store/auth/auth.selectors';
import { CookieService } from 'ngx-cookie-service';
import { User } from '../../../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class LearningGuard implements CanActivate {
  isAutehnticated: boolean;

  constructor(
    private store: Store<AuthState>,
    private router: Router,
    private cookieService: CookieService
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
    console.log('Activated route snapshot', next);
    console.log('Router state snapshot', state);
    return true;
    /* if (this.isAutehnticated) {
      this.store.pipe(select(selectAuthUser)).subscribe((user: User) => {

      });
      return true;
    }
    const userToken = this.cookieService.get('userToken');
    if (userToken) {
      return true;
    } else {
      this.router.navigate(['/courses/cart']);
      return false;
    } */
  }

}
