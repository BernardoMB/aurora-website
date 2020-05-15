
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { CookieService } from 'ngx-cookie-service';
import { map } from 'rxjs/operators';
import { AuthState } from '../store/auth/auth.state';
import { selectAuthIsAuthenticated } from '../store/auth/auth.selectors';
import { AuthService } from '../services/auth.service';
import { getUserInfo } from '../store/auth/auth.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
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
    if (this.isAutehnticated) {
      return true;
    }
    const userToken = this.cookieService.get('userToken');
    if (userToken) {
      return this.authService.signinWithToken().pipe(
        map((response) => {
          // console.log('Status', response.status);
          if (response.status === 200 || response.status === 201) {
            const authorizationHeader = response.headers.get('Authorization');
            // console.log(authorizationHeader);
            const token = authorizationHeader.split(' ')[1];
            this.store.dispatch(getUserInfo({token}));
            return true;
          } else {
            console.log(`AuthGuard: User token found in local storage is not valid. Redirecting to /home`);
            this.router.navigate(['/home']);
            return false;
          }
        })
      );
    }
    console.log(`AuthGuard: No user or token found and no user in state. Redirecting to /home`);
    this.router.navigate(['/home']);
    return false;
  }

}
