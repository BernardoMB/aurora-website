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
} from './auth.actions';
import { of } from 'rxjs';
import { GetUserDto } from '../../shared/dtos/get-user.dto';
import { CookieService } from 'ngx-cookie-service';
import { log } from '../../shared/utils';
import { HttpErrorResponse } from '@angular/common/http';

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
            this.cookieService.set('userToken', responseBody.accessToken);
            // TODO: use environment variables below
            // this.cookieService.set('userToken', responseBody.accessToken, undefined, '/', 'http://localhost:4200', true, 'Strict');
            return loginSuccess();
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            log('Catched error from service:', errorResponse);
            log('Dispatching login failure action');
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
          map((responseBody: GetUserDto) => {
            log('loginSuccessEffect:', responseBody);
            return getUserInfoSuccess({
              id: responseBody.id,
              email: responseBody.email,
              username: responseBody.username,
              emailVerified: responseBody.emailVerified,
              name: responseBody.name,
              lastName: responseBody.lastName,
              purchasedCourses: responseBody.purchasedCourses,
            });
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
          map((responseBody: GetUserDto) => {
            log('loginSuccessEffect:', responseBody);
            return getUserInfoSuccess({
              id: responseBody.id,
              email: responseBody.email,
              username: responseBody.username,
              emailVerified: responseBody.emailVerified,
              name: responseBody.name,
              lastName: responseBody.lastName,
              purchasedCourses: responseBody.purchasedCourses,
            });
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
          map((responseBody: GetUserDto) => {
            log('loginSuccessEffect:', responseBody);
            return getUserInfoSuccess({
              id: responseBody.id,
              email: responseBody.email,
              username: responseBody.username,
              emailVerified: responseBody.emailVerified,
              name: responseBody.name,
              lastName: responseBody.lastName,
              purchasedCourses: responseBody.purchasedCourses,
            });
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
          log('Deleteing usertToken cookie...');
          this.cookieService.delete('userToken');
        }),
      ),
    { dispatch: false },
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private cookieService: CookieService,
  ) {}
}
