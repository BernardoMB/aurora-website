import { Injectable, Injector } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
  HttpResponse,
  HttpHeaders,
} from '@angular/common/http';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { Observable, of as observableOf, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
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
    log('Token interceptor: Intercepting request', request.url);
    this.authService = this.injector.get(AuthService);
    log('Token interceptor: Getting user token from cookie...');
    const userToken: string = this.cookieService.get('userToken');
    if (userToken) {
      log('Token interceptor: User token found!');
      log('Token interceptor: Modifiying request...');
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
      });
      log('Modified request:', request);
    } else {
      log('Token interceptor: No user token is present!');
    }
    log('Token interceptor: Handling request');
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          console.log('Manipulating response object');
          const response = event;
          const authorizationHeader = response.headers.get('Authorization');
          if (authorizationHeader) {
            log('Authorization header is present');
            const incomingUserToken = authorizationHeader.split(' ')[1];
            console.log('Refreshing token');
            // Refresh bearer token
            const pastToken = this.cookieService.get('userToken');
            if (pastToken) {
              this.cookieService.delete('userToken');
            }
            this.cookieService.set('userToken', incomingUserToken);
            // TODO: use environment variables below to change cookie handling
            // this.cookieService.set('userToken', incomingUserToken, undefined, '/', 'http://localhost:4200', true, 'Strict');
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
        log('ErrorInterceptor: Response interceptor catched error!');
        if (error instanceof HttpErrorResponse && error.status === 401) {
          log('ErrorInterceptor: Response status is 401 (unauthorized)');
          log('ErrorInterceptor: Removeing userToken');
          this.cookieService.delete('userToken');
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
