import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Store, select } from '@ngrx/store';
import { loginWithToken, addCoursesToCart, getCoursesFrommCookiesSuccess } from './store/auth/auth.actions';
import { log } from './shared/utils';
import { User } from './shared/models/user.model';
import { selectAuthUser, selectAuthState, selectAuthCart2 } from './store/auth/auth.selectors';
import { State } from './store/state';
import { Course } from './shared/models/course.model';
import { AuthService } from './services/auth.service';
import { CoursesService } from './modules/courses/services/courses.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  user: User;

  constructor(
    private cookieService: CookieService,
    private store: Store<State>,
    private coursesService: CoursesService
  ) {}

  ngOnInit() {
    const token = this.cookieService.get('userToken');
    if (token) {
      log('AppComponent: User token found! Dispatching login action');
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
        this.store.pipe(select(selectAuthCart2)).subscribe((cart2: Course[]) => {
          if (cart2 && cart2.length > 0) {
            this.store.dispatch(addCoursesToCart({courses: cart2}));
          }
        });
      } else {
        this.user = undefined;
      }
    });
  }
}
