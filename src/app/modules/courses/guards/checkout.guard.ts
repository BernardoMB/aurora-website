import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthState } from '../../../store/auth/auth.state';
import { Store, select } from '@ngrx/store';
import { selectAuthIsAuthenticated } from '../../../store/auth/auth.selectors';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../../services/auth.service';
import { map } from 'rxjs/operators';
import { getUserInfo } from '../../../store/auth/auth.actions';

@Injectable({
  providedIn: 'root'
})
export class CheckoutGuard implements CanActivate {
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
      console.log('CheckoutGuard: Authenticated state is true. Access granted');
      return true;
    }
    // const userToken = this.cookieService.get('userToken');
    const userToken = localStorage.getItem('userToken');
    if (userToken) {
      /* // TODO: A request should be made here to check if the user token found is valid
      console.log('CheckoutGuard: Authenticated state is false but user token found. Access granted');
      return true; */

      // #region Comment in case anything goes wrong
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
            console.log(`CheckoutGuard: User token found in local storage is not valid. Access denied`);
            // this.router.navigate(['/home']);
            return false;
          }
        })
      );
      // #endregion

    } else {
      console.log('CheckoutGuard: Authenticated state is false and no user token found. Access denied');
      console.log('CheckoutGuard: Access denied. Redirecting to /courses');
      this.router.navigate(['/courses']);
      return false;
    }
  }

}
