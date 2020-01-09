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
} from './auth.actions';
import { of } from 'rxjs';
import { GetUserDto } from '../../shared/dtos/get-user.dto';
import { CookieService } from 'ngx-cookie-service';

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
                        this.cookieService.set(
                            'userToken',
                            responseBody.accessToken,
                        );
                        return loginSuccess();
                    }),
                    catchError(error => of(loginFailure({ error }))),
                ),
            ),
        ),
    );

    loginSuccessEffect$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loginSuccess),
            exhaustMap(action =>
                this.authService.getUserInfo().pipe(
                    map((responseBody: GetUserDto) =>
                        getUserInfoSuccess({
                            id: responseBody.id,
                            email: responseBody.email,
                            username: responseBody.username,
                            emailVerified: responseBody.emailVerified,
                        }),
                    ),
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
                    map((responseBody: GetUserDto) =>
                        getUserInfoSuccess({
                            id: responseBody.id,
                            email: responseBody.email,
                            username: responseBody.username,
                            emailVerified: responseBody.emailVerified,
                        }),
                    ),
                    catchError(error => of(loginFailure({ error }))),
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
                        .pipe(catchError(error => of(loginFailure({ error })))),
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
                    map((responseBody: GetUserDto) =>
                        getUserInfoSuccess({
                            id: responseBody.id,
                            email: responseBody.email,
                            username: responseBody.username,
                            emailVerified: responseBody.emailVerified,
                        }),
                    ),
                    catchError(error => of(getUserInfoFailure({ error }))),
                ),
            ),
        ),
    );

    logoutEffect$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(logout),
                tap(action => this.cookieService.delete('userToken')),
            ),
        { dispatch: false },
    );

    constructor(
        private actions$: Actions,
        private authService: AuthService,
        private cookieService: CookieService,
    ) {}
}
