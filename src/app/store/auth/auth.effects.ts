import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap, exhaustMap, catchError } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import {
    login,
    loginSuccess,
    loginFailure,
    getUserInfoSuccess,
} from './auth.actions';
import { of } from 'rxjs';
import { GetUserDto } from '../../shared/dtos/get-user.dto';
import { CookieService } from 'ngx-cookie-service';

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
                    catchError(error => of(loginFailure({ error }))),
                ),
            ),
        ),
    );

    constructor(
        private actions$: Actions,
        private authService: AuthService,
        private cookieService: CookieService,
    ) {}
}
