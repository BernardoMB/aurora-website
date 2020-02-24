import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, exhaustMap, catchError, tap } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import {
  login,
  loginSuccess,
  loginFailure,
  getUserInfoSuccess,
  getUserInfoFailure,
  getUserInfo,
  signup,
  loginWithToken,
  loginWithTokenSuccess,
  loginWithTokenFailure,
  logout,
  signupFailure,
  addCourseToCart,
  addCourseToCartSuccess,
  addCoursesToCart,
  addCoursesToCartSuccess,
  addCoursesToCartFailure,
  removeCourseFromCartSuccess,
  removeCourseFromCartFailure,
  addCourseToCartFailure,
  removeCourseFromCart,
  purchaseCartSuccess,
  purchaseCartFailure,
  purchaseCart,
  purchaseCourse,
  purchaseCourseSuccess,
  purchasecourseFailure,
  completeLesson,
  completeLessonSuccess,
  completeLessonFailure,
} from './auth.actions';
import { of } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from '../../shared/models/user.model';
import { Course } from '../../shared/models/course.model';
import { Router } from '@angular/router';

/**
 * Authentication effects
 * TODO: Implement failure effects
 *
 * @export
 */
@Injectable()
export class AuthEffects {
  loginEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      exhaustMap(action =>
        this.authService.signin(action.username, action.password).pipe(
          map((responseBody: { accessToken: string }) => {
            this.cookieService.delete('userToken', '/');
            this.cookieService.set('userToken', responseBody.accessToken, null, '/');
            return loginSuccess();
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(
              loginFailure({
                error: errorResponse,
                message: errorResponse.error.message,
              }),
            );
          }),
        ),
      ),
    ),
  );

  loginSuccessEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginSuccess),
      exhaustMap(action =>
        this.authService.getUserInfo().pipe(
          map((responseBody: User) => {
            return getUserInfoSuccess({ user: responseBody });
          }),
          catchError(error => of(getUserInfoFailure({ error }))),
        ),
      ),
    ),
  );

  getUserInfoEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getUserInfo),
      exhaustMap(action =>
        this.authService.getUserInfo().pipe(
          map((responseBody: User) => {
            return getUserInfoSuccess({ user: responseBody });
          }),
          catchError((errorResponse: HttpErrorResponse) =>
            of(
              loginFailure({
                error: errorResponse,
                message: errorResponse.error.message,
              }),
            ),
          ),
        ),
      ),
    ),
  );

  getUserInfoSuccessEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getUserInfoSuccess),
      tap(action => {
        this.cookieService.delete('cartCookie');
      }),
    ), { dispatch: false }
  );

  signupEffect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(signup),
        exhaustMap(action =>
          this.authService
            .signup(action)
            .pipe(catchError(error => of(signupFailure({ error })))),
        ),
      ),
    { dispatch: false },
  );

  loginWithTokenEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginWithToken),
      exhaustMap(action =>
        this.authService.signinWithToken().pipe(
          map(() => loginWithTokenSuccess()),
          catchError(error => of(loginWithTokenFailure({ error }))),
        ),
      ),
    ),
  );

  loginWithTokenSuccessEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginWithTokenSuccess),
      exhaustMap(action =>
        this.authService.getUserInfo().pipe(
          map((responseBody: User) => {
            return getUserInfoSuccess({ user: responseBody });
          }),
          catchError(error => of(getUserInfoFailure({ error }))),
        ),
      ),
    ),
  );

  logoutEffect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(logout),
        tap(action => {
          // console.log('Deleteing usertToken cookie...');
          this.cookieService.delete('userToken', '/');
          // console.log('AuthEffects: logoutEffect$: Redirecting to landing page ("/")');
          this.router.navigate(['/']);
        }),
      ),
    { dispatch: false },
  );

  addCourseToCartEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addCourseToCart),
      exhaustMap(action =>
        this.authService.addCoursetoShoppingCart(action.courseId, action.userId).pipe(
          map((responseBody: Course) => {
            return addCourseToCartSuccess({ course: responseBody});
          }),
          catchError((errorResponse: HttpErrorResponse) =>
            of(
              addCourseToCartFailure({
                error: errorResponse,
                message: errorResponse.error.message,
              }),
            ),
          ),
        ),
      ),
    ),
  );

  removeCourseFromCartEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removeCourseFromCart),
      exhaustMap(action =>
        this.authService.removeCourseFromShoppingCart(action.courseId, action.userId).pipe(
          map((responseBody: Course) => {
            return removeCourseFromCartSuccess({ course: responseBody });
          }),
          catchError((errorResponse: HttpErrorResponse) =>
            of(
              removeCourseFromCartFailure({
                error: errorResponse,
                message: errorResponse.error.message,
              }),
            ),
          ),
        ),
      ),
    ),
  );

  addCoursesToCartEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addCoursesToCart),
      exhaustMap(action =>
        this.authService.addCoursesToShoppingCart(action.courses).pipe(
          map((responseBody: User) => {
            return addCoursesToCartSuccess({ user: responseBody });
          }),
          catchError((errorResponse: HttpErrorResponse) =>
            of(
              addCoursesToCartFailure({
                error: errorResponse,
                message: errorResponse.error.message,
              }),
            ),
          ),
        ),
      ),
    ),
  );

  addCoursesToCartSuccessEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addCoursesToCartSuccess),
      tap(action => {
        this.cookieService.delete('cartCookie');
      }),
    ), { dispatch: false }
  );

  purchaseCoursesEffect$ = createEffect(() =>
  this.actions$.pipe(
    ofType(purchaseCart),
    exhaustMap(action =>
      this.authService.purchaseCart(action.courses, action.userId).pipe(
        map((responseBody: User) => {
          return purchaseCartSuccess(responseBody);
        }),
        catchError((errorResponse: HttpErrorResponse) =>
            of(
              purchaseCartFailure({
                error: errorResponse,
                message: errorResponse.error.message,
              }),
              ),
          ),
          ),
      ),
      ),
  );

  purchaseCourseEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(purchaseCourse),
      exhaustMap(action =>
        this.authService.purchaseCourse(action.course, action.userId).pipe(
          map((responseBody: Course) => {
            return purchaseCourseSuccess({ course: responseBody });
          }),
          catchError((errorResponse: HttpErrorResponse) =>
            of(
              purchasecourseFailure({
                error: errorResponse,
                message: errorResponse.error.message,
              }),
            ),
          ),
        ),
      ),
    ),
  );

  purchaseCourseSuccessEffect$ = createEffect(() =>
  this.actions$.pipe(
    ofType(purchaseCourseSuccess),
    tap(action => {
      // Navigate to course detail view once purchased
      console.log(`purchaseCourseSuccessEffect: Redirecting to /courses`);
      this.router.navigate(['/courses', action.course.id]);
    }),
    ), { dispatch: false }
  );

  completeLessonEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(completeLesson),
      exhaustMap(action =>
        this.authService.completeLesson(action.courseId, action.lessonId).pipe(
          map(() => {
            return completeLessonSuccess({ courseId: action.courseId, lessonId: action.lessonId});
          }),
          catchError((errorResponse: HttpErrorResponse) =>
            of(
              completeLessonFailure({
                error: errorResponse,
                message: errorResponse.error.message,
              }),
            ),
          ),
        ),
      ),
    ),
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private cookieService: CookieService,
    private router: Router
  ) {}
}
