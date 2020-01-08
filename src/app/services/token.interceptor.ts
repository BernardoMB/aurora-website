import { Injectable, Injector } from '@angular/core';
import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpErrorResponse,
} from '@angular/common/http';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { Observable, of as observableOf, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { log } from '../shared/utils';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    private authService: AuthService;
    constructor(
        private injector: Injector,
        private cookieService: CookieService,
    ) {}
    intercept(
        request: HttpRequest<any>,
        next: HttpHandler,
    ): Observable<HttpEvent<any>> {
        // console.log('Token interceptor: Intercepting request', request.url);
        log('Token interceptor: Intercepting request', request.url);
        this.authService = this.injector.get(AuthService);
        // console.log('Token interceptor: Getting refresh token from cookie...');
        log('Token interceptor: Getting refresh token from cookie...');
        const userToken: string = this.cookieService.get('userToken');
        if (userToken) {
            // console.log('Token interceptor: Refresh token found!');
            log('Token interceptor: Refresh token found!');
            // console.log('Token interceptor: Modifiying request...');
            log('Token interceptor: Modifiying request...');
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${userToken}`,
                    'Content-Type': 'application/json',
                },
            });
            // console.log('Modified request:', request);
            log('Modified request:', request);
        } else {
            // console.log('Token interceptor: No refresh token is present!');
            log('Token interceptor: No refresh token is present!');
        }
        // console.log('Token interceptor: Handling request');
        log('Token interceptor: Handling request');
        return next.handle(request);
    }
}

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private router: Router, private cookieService: CookieService) {}
    intercept(
        request: HttpRequest<any>,
        next: HttpHandler,
    ): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            catchError(error => {
                if (
                    error instanceof HttpErrorResponse &&
                    error.status === 401
                ) {
                    // console.log('Error interceptor: Response status is 401 (unauthorized)');
                    log(
                        'Error interceptor: Response status is 401 (unauthorized)',
                    );
                    // console.log('Error interceptor: Removeing refresh and id tokens');
                    log('Error interceptor: Removeing refresh and id tokens');
                    // localStorage.removeItem('idToken');
                    this.cookieService.delete('idToken');
                    // localStorage.removeItem('refreshToken');
                    this.cookieService.delete('refreshToken');
                    // console.log('Error interceptor: Redirecting to login page');
                    log('Error interceptor: Redirecting to login page');
                    this.router.navigateByUrl('/log-in');
                }
                // console.error('Response interceptor catched error!');
                log('Response interceptor catched error!');
                return throwError(error);
            }),
        );
    }
}