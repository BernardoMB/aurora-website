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
  addCourseToFavorites,
  addCourseToFavoritesSuccess,
  addCourseToFavoritesFailure,
  removeCourseFromFavorites,
  removeCourseFromFavoritesSuccess,
  removeCourseFromFavoritesFailure,
  addCourseToWishlist,
  addCourseToWishlistSuccess,
  addCourseToWishlistFailure,
  removeCourseFromWishlist,
  removeCourseFromWishlistSuccess,
  removeCourseFromWishlistFailure,
  addCourseToArchive,
  addCourseToArchiveSuccess,
  addCourseToArchiveFailure,
  removeCourseFromArchive,
  removeCourseFromArchiveSuccess,
  removeCourseFromArchiveFailure,
  updateProfileInfo,
  updateProfileInfoSuccess,
  updateProfileInfoFailure,
  changeUserPassword,
  changeUserPasswordSuccess,
  changeUserPasswordFailure,
  changeUsername,
  changeUsernameSuccess,
  changeUsernameFailure,
  enrollCourse,
  enrollCourseSuccess,
  enrollCourseFailure,
  likeArticle,
  undislikeArticle,
  dislikeArticle,
  unlikeArticle,
} from './auth.actions';
import { of } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from '../../shared/models/user.model';
import { Course } from '../../shared/models/course.model';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

/**
 * Authentication effects
 * TODO: Implement failure effects
 * TODO: Add change email effects
 *
 * @export
 */
@Injectable()
export class AuthEffects {
  loginEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      exhaustMap((action) =>
        this.authService.signin(action.username, action.password).pipe(
          map((responseBody: { accessToken: string }) => {
            console.log('LoginEffect: Replacing user token cookie');
            // this.cookieService.delete('userToken', '/');
            localStorage.removeItem('userToken');
            // this.cookieService.set('userToken', responseBody.accessToken);
            localStorage.setItem('userToken', responseBody.accessToken);
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
      exhaustMap((action) =>
        this.authService.getUserInfo().pipe(
          map((responseBody: User) => {
            return getUserInfoSuccess({ user: responseBody });
          }),
          catchError((error) => of(getUserInfoFailure({ error }))),
        ),
      ),
    ),
  );

  likeArticleEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(likeArticle),
      map(({ articleId }) => undislikeArticle({ articleId })),
    ),
  );

  dislikeArticleEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(dislikeArticle),
      map(({ articleId }) => unlikeArticle({ articleId })),
    ),
  );

  getUserInfoEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getUserInfo),
      exhaustMap((action) =>
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

  getUserInfoSuccessEffect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(getUserInfoSuccess),
        tap((action) => {
          // this.cookieService.delete('cartCookie');
          localStorage.removeItem('cartCookie');
        }),
      ),
    { dispatch: false },
  );

  signupEffect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(signup),
        exhaustMap((action) =>
          this.authService.signup(action).pipe(
            tap(() => {
              /* console.log('AuthEffects: Signup successfull redirecting to \'/\'');
                this.router.navigate(['/']); */
              this.toastr.success('Check you email address');
            }),
            catchError((error) => {
              this.toastr.error(error.message);
              return of(signupFailure({ error }));
            }),
          ),
        ),
      ),
    { dispatch: false },
  );

  loginWithTokenEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginWithToken),
      exhaustMap((action) =>
        this.authService.signinWithToken().pipe(
          map(() => loginWithTokenSuccess()),
          catchError((error) => of(loginWithTokenFailure({ error }))),
        ),
      ),
    ),
  );

  loginWithTokenSuccessEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginWithTokenSuccess),
      exhaustMap((action) =>
        this.authService.getUserInfo().pipe(
          map((responseBody: User) => {
            return getUserInfoSuccess({ user: responseBody });
          }),
          catchError((error) => of(getUserInfoFailure({ error }))),
        ),
      ),
    ),
  );

  logoutEffect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(logout),
        tap((action) => {
          console.log('LogoutEffect: Deleteing usert token cookie');
          // this.cookieService.delete('userToken', '/');
          localStorage.removeItem('userToken');
          // console.log('AuthEffects: logoutEffect$: Redirecting to landing page ("/")');
          this.router.navigate(['/']);
        }),
      ),
    { dispatch: false },
  );

  changeUserPasswordEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(changeUserPassword),
      exhaustMap((action) =>
        this.authService
          .changeUserPassword(
            action.password,
            action.newPassword,
            action.newPasswordConfirmation,
          )
          .pipe(
            map((responseBody: User) => {
              return changeUserPasswordSuccess();
            }),
            catchError((errorResponse: HttpErrorResponse) => {
              console.log(
                'changeUserPasswordEffect: Catched error. firing failure action',
              );
              return of(
                changeUserPasswordFailure({
                  error: errorResponse,
                  message: errorResponse.error.message,
                }),
              );
            }),
          ),
      ),
    ),
  );

  changeUserPasswordSuccessEffect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(changeUserPasswordSuccess),
        tap((action) => {
          this.toastr.success('Password changed');
        }),
      ),
    { dispatch: false },
  );

  changeUserPasswordFailureEffect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(changeUserPasswordFailure),
        tap((action) => {
          console.error(action.error);
          this.toastr.error(action.message, 'Check you current password');
        }),
      ),
    { dispatch: false },
  );

  changeUsernameEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(changeUsername),
      exhaustMap((action) =>
        this.authService.changeUsername(action.username).pipe(
          map((responseBody: User) => {
            return changeUsernameSuccess(responseBody);
          }),
          catchError((errorResponse: HttpErrorResponse) =>
            of(
              changeUsernameFailure({
                error: errorResponse,
                message: errorResponse.error.message,
              }),
            ),
          ),
        ),
      ),
    ),
  );

  changeUsernameEffectSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(changeUsernameSuccess),
        tap((action) => {
          this.toastr.success('Username updated');
        }),
      ),
    { dispatch: false },
  );

  changeUsernameEffectEffectFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(changeUsernameFailure),
        tap((action) => {
          console.error(action.error);
          this.toastr.error(action.message + '.', 'Choose another username');
        }),
      ),
    { dispatch: false },
  );

  updateProfileInfoEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateProfileInfo),
      exhaustMap((action) =>
        this.authService.updateProfileInfo(action.profileInfo).pipe(
          map((responseBody: User) => {
            return updateProfileInfoSuccess(responseBody);
          }),
          catchError((errorResponse: HttpErrorResponse) =>
            of(
              updateProfileInfoFailure({
                error: errorResponse,
                message: errorResponse.error.message,
              }),
            ),
          ),
        ),
      ),
    ),
  );

  updateProfileInfoEffectSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(updateProfileInfoSuccess),
        tap((action) => {
          this.toastr.success('Profile updated');
        }),
      ),
    { dispatch: false },
  );

  addCourseToCartEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addCourseToCart),
      exhaustMap((action) =>
        this.authService
          .addCoursetoShoppingCart(action.courseId, action.userId)
          .pipe(
            map((responseBody: Course) => {
              return addCourseToCartSuccess({ course: responseBody });
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
      exhaustMap((action) =>
        this.authService
          .removeCourseFromShoppingCart(action.courseId, action.userId)
          .pipe(
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
      exhaustMap((action) =>
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

  addCoursesToCartSuccessEffect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(addCoursesToCartSuccess),
        tap((action) => {
          // this.cookieService.delete('cartCookie');
          localStorage.removeItem('cartCookie');
        }),
      ),
    { dispatch: false },
  );

  // TODO: delete this effect. Payment logic should be handled with no effects
  purchaseCoursesEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(purchaseCart),
      exhaustMap((action) =>
        this.authService
          .purchaseCart(
            action.userId,
            action.courses,
            action.paymentMethod,
            action.country,
            action.paymentInfo,
          )
          .pipe(
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
      exhaustMap((action) =>
        // TODO: pass payment info
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

  purchaseCourseSuccessEffect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(purchaseCourseSuccess),
        tap((action) => {
          // Navigate to course detail view once purchased
          console.log(`purchaseCourseSuccessEffect: Redirecting to /courses`);
          this.router.navigate(['/courses', action.course.id]);
        }),
      ),
    { dispatch: false },
  );

  enrollCourseEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(enrollCourse),
      exhaustMap((action) =>
        this.authService.enrollCourse(action.courseId, action.userId).pipe(
          map((responseBody: Course) => {
            return enrollCourseSuccess(responseBody);
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(
              enrollCourseFailure({
                error: errorResponse,
                message: errorResponse.error.message,
              }),
            );
          }),
        ),
      ),
    ),
  );

  enrollCourseSuccessEffect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(enrollCourseSuccess),
        tap((action) => {
          this.toastr.success('You are now enrolled.', 'Enjoy!');
        }),
      ),
    { dispatch: false },
  );

  enrollCourseFailureEffect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(enrollCourseFailure),
        tap((action) => {
          this.toastr.error(action.message, 'Cannot enroll.');
        }),
      ),
    { dispatch: false },
  );

  completeLessonEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(completeLesson),
      exhaustMap((action) =>
        this.authService.completeLesson(action.courseId, action.lessonId).pipe(
          map(() => {
            return completeLessonSuccess({
              courseId: action.courseId,
              lessonId: action.lessonId,
            });
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

  addCoursesToFavoritesEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addCourseToFavorites),
      exhaustMap((action) =>
        this.authService
          .addCourseToFavorites(action.courseId, action.userId)
          .pipe(
            map((responseBody: User) => {
              return addCourseToFavoritesSuccess({ courseId: action.courseId });
            }),
            catchError((errorResponse: HttpErrorResponse) =>
              of(
                addCourseToFavoritesFailure({
                  error: errorResponse,
                  message: errorResponse.error.message,
                }),
              ),
            ),
          ),
      ),
    ),
  );

  removeCoursesFromFavoritesEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removeCourseFromFavorites),
      exhaustMap((action) =>
        this.authService
          .removeCourseFromFavorites(action.courseId, action.userId)
          .pipe(
            map((responseBody: User) => {
              return removeCourseFromFavoritesSuccess({
                courseId: action.courseId,
              });
            }),
            catchError((errorResponse: HttpErrorResponse) =>
              of(
                removeCourseFromFavoritesFailure({
                  error: errorResponse,
                  message: errorResponse.error.message,
                }),
              ),
            ),
          ),
      ),
    ),
  );

  addCoursesToWishlistEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addCourseToWishlist),
      exhaustMap((action) =>
        this.authService
          .addCourseToWishlist(action.courseId, action.userId)
          .pipe(
            map((responseBody: User) => {
              return addCourseToWishlistSuccess({ courseId: action.courseId });
            }),
            catchError((errorResponse: HttpErrorResponse) =>
              of(
                addCourseToWishlistFailure({
                  error: errorResponse,
                  message: errorResponse.error.message,
                }),
              ),
            ),
          ),
      ),
    ),
  );

  removeCoursesFromWishlistEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removeCourseFromWishlist),
      exhaustMap((action) =>
        this.authService
          .removeCourseFromWishlist(action.courseId, action.userId)
          .pipe(
            map((responseBody: User) => {
              return removeCourseFromWishlistSuccess({
                courseId: action.courseId,
              });
            }),
            catchError((errorResponse: HttpErrorResponse) =>
              of(
                removeCourseFromWishlistFailure({
                  error: errorResponse,
                  message: errorResponse.error.message,
                }),
              ),
            ),
          ),
      ),
    ),
  );

  addCoursesToArchiveEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addCourseToArchive),
      exhaustMap((action) =>
        this.authService
          .addCourseToArchive(action.courseId, action.userId)
          .pipe(
            map((responseBody: User) => {
              return addCourseToArchiveSuccess({ courseId: action.courseId });
            }),
            catchError((errorResponse: HttpErrorResponse) =>
              of(
                addCourseToArchiveFailure({
                  error: errorResponse,
                  message: errorResponse.error.message,
                }),
              ),
            ),
          ),
      ),
    ),
  );

  removeCoursesFromArchiveEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removeCourseFromArchive),
      exhaustMap((action) =>
        this.authService
          .removeCourseFromArchive(action.courseId, action.userId)
          .pipe(
            map((responseBody: User) => {
              return removeCourseFromArchiveSuccess({
                courseId: action.courseId,
              });
            }),
            catchError((errorResponse: HttpErrorResponse) =>
              of(
                removeCourseFromArchiveFailure({
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
    private router: Router,
    private toastr: ToastrService,
  ) {}
}
