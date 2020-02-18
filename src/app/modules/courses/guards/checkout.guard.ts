import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthState } from '../../../store/auth/auth.state';
import { Store, select } from '@ngrx/store';
import { selectAuthIsAuthenticated } from '../../../store/auth/auth.selectors';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class CheckoutGuard implements CanActivate {
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
    if (this.isAutehnticated) {
      return true;
    }
    const userToken = this.cookieService.get('userToken');
    if (userToken) {
      return true;
    } else {
      console.log('Checkout guard: Redirecting to /courses');
      this.router.navigate(['/courses']);
      return false;
    }
  }

}
