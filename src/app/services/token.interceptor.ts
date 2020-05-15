import { Injectable, Injector } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { Observable, of as observableOf, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';

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
    this.authService = this.injector.get(AuthService);
    // console.log('Token interceptor: Getting user token from cookie...');
    const userToken: string = this.cookieService.get('userToken');
    if (userToken) {
      // console.log('Token interceptor: User token found!');
      // console.log('Token interceptor: Modifiying request...');
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
      });
      // console.log('Modified request:', request);
    } else {
      // console.log('Token interceptor: No user token is present!');
    }
    // console.log('Token interceptor: Handling request');
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          // console.log('Manipulating response object');
          const response = event;
          const authorizationHeader = response.headers.get('Authorization');
          if (authorizationHeader) {
            // console.log('Authorization header is present');
            const incomingUserToken = authorizationHeader.split(' ')[1];
            // console.log('Refreshing token');
            // Refresh bearer token
            const pastToken = this.cookieService.get('userToken');
            if (pastToken) {
              console.log('TokenInterceptor: Deleting user token cookie');
              this.cookieService.delete('userToken', '/');
            }
            console.log('TokenInterceptor: Replacing user token cookie');
            this.cookieService.delete('userToken', '/');
            this.cookieService.set('userToken', incomingUserToken, null, '/');
          }
        }
        return event;
      }),
    );
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
        console.log('ErrorInterceptor: Response interceptor catched error!');
        if (error instanceof HttpErrorResponse && error.status === 401) {
          // console.log('ErrorInterceptor: Response status is 401 (unauthorized)');
          // console.log('ErrorInterceptor: Removeing userToken');
          console.log('TokenInterceptor: Deleting user token cookie');
          this.cookieService.delete('userToken', '/');
          /**
           * No redirecting is need
           * // log('ErrorInterceptor: Redirecting to login page');
           * // this.router.navigateByUrl('/log-in');
           */
        }
        return throwError(error);
      }),
    );
  }
}
