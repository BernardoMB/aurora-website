import { Component, OnInit, OnDestroy } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Store, select } from '@ngrx/store';
import { loginWithToken, addCoursesToCart, getCoursesFrommCookiesSuccess } from './store/auth/auth.actions';
import { User } from './shared/models/user.model';
import { selectAuthUser, selectAuthCart2 } from './store/auth/auth.selectors';
import { State } from './store/state';
import { Course } from './shared/models/course.model';
import { CoursesService } from './modules/courses/services/courses.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  user: User;
  cart2Subscription: Subscription;

  constructor(
    private cookieService: CookieService,
    private store: Store<State>,
    private coursesService: CoursesService
  ) {}

  ngOnInit() {
    const token = this.cookieService.get('userToken');
    if (token) {
      console.log('AppComponent: User token found! Dispatching login action');
      this.store.dispatch(loginWithToken());
    }

    const cartCookie = this.cookieService.get('cartCookie');
    if (cartCookie) {
      const cartCookieArray: string[] = JSON.parse(cartCookie);
      if (cartCookieArray && cartCookieArray.length > 0) {
        this.coursesService.getCourses(cartCookieArray).subscribe((courses: Course[]) => {
          if (courses && courses.length > 0) {
            this.store.dispatch(getCoursesFrommCookiesSuccess({courses}));
            this.cookieService.delete('cartCookie');
            this.cookieService.set('cartCookie', JSON.stringify(cartCookieArray));
          }
        });
      }
    }

    this.store.pipe(select(selectAuthUser)).subscribe((user: User) => {
      if (user) {
        this.user = user;
        this.cart2Subscription = this.store.pipe(select(selectAuthCart2)).subscribe((cart2: Course[]) => {
          // cart2 is where courses are stored when they are added into the the cart withoud being logged in
          if (cart2 && cart2.length > 0 && this.user) {
            this.store.dispatch(addCoursesToCart({courses: cart2}));
          }
        });
      } else {
        this.user = undefined;
        if (this.cart2Subscription) {
          this.cart2Subscription.unsubscribe();
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.cart2Subscription.unsubscribe();
  }
}
