import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { User } from '../shared/models/user.model';
import { SignupDto } from '../shared/dtos/signup.dto';
import { environment } from '../../environments/environment';
import { Course } from '../shared/models/course.model';
import { tap, catchError } from 'rxjs/operators';

/**
 * TODO: Add changeUsername function
 * TODO: Add changeEmail  function
 *
 * @export
 * @class AuthService
 */
@Injectable()
export class AuthService {
  host = environment.host;
  apiVersion = environment.apiVersion;

  private emptyResetPasswordFormSubject = new BehaviorSubject<boolean>(false);
  public emptyResetPasswordForm$ = this.emptyResetPasswordFormSubject.asObservable();

  private signupErrorSubject = new BehaviorSubject<string>(null);
  public signupError$ = this.signupErrorSubject.asObservable();

  private signupIsSuccessfullSubject = new BehaviorSubject<boolean>(false);
  public signupIsSuccessfull$ = this.signupIsSuccessfullSubject.asObservable();

  constructor(private http: HttpClient) {}

  getStatus(): Observable<any> {
    const url = `${this.host}/status`;
    return this.http.get<any>(url);
  }

  signup(signupDto: SignupDto): Observable<User> {
    console.log('Auth service: Registering a user sending signup dto');
    const url = `${this.host}/${this.apiVersion}/auth/signup`;
    return this.http.post<User>(url, signupDto).pipe(
      tap(() => {
        this.signupIsSuccessfullSubject.next(true);
      }),
      catchError((errorResponse: HttpErrorResponse) => {
        this.signupErrorSubject.next(errorResponse.error.message);
        throw errorResponse.error;
      })
    );
  }

  signin(username: string, password: string): Observable<any> {
    console.log('Auth service: Loging in sending credentials');
    const url = `${this.host}/${this.apiVersion}/auth/signin`;
    return this.http.post<{ accessToken: string }>(url, {
      username,
      password,
    });
  }

  getUserInfo(): Observable<User> {
    console.log('Auth service: Getting user info');
    const url = `${this.host}/${this.apiVersion}/auth/user/me?populate=cart`;
    return this.http.get<User>(url)/* .pipe(
      tap((response: any) => {
        console.log('\n\n');
        console.log('Getting user info response', response);
        console.log('\n\n');
      })
    ) */;
  }

  getUserCards(): Observable<any> { // TODO: Sepecify type to receive here
    // TODO: This endpoint does not exists on server
    console.log('Auth service: Getting user cards');
    const url = `${this.host}/${this.apiVersion}/auth/user/me/cards`;
    // return this.http.get<User>(url); // TODO: Uncomment this line when edpoint redy
    return new Observable(obs => {
      setTimeout(() => {
        obs.next([1, 2, 3]);
        obs.complete();
      }, 2000);
    });
  }

  signinWithToken(): Observable<any> {
    console.log('Auth service: Loging in sending user token');
    const url = `${this.host}/${this.apiVersion}/auth/signinWithToken`;
    return this.http.post(url, {}, { observe: 'response' });
  }

  changeUserPassword(password: string, newPassword: string, newPasswordConfirmation: string): Observable<User> {
    console.log('Auth service: changing user password');
    const url = `${this.host}/${this.apiVersion}/auth/user/password`;
    return this.http.patch<User>(url, { password, newPassword, newPasswordConfirmation }).pipe(
      tap(() => {
        this.emptyResetPasswordFormSubject.next(true);
      }),
      catchError((error) => {
        // Catching and throwing error so error can be handled by the effect that triggered this call
        throw error;
      })
    );
  }

  checkUsernameAvailability(username: string): Observable<{ usernameIsAvailable: boolean }> {
    console.log('Auth service: Checking username availability');
    const url = `${this.host}/${this.apiVersion}/auth/checkUsernameAvalability`;
    return this.http.post<{ usernameIsAvailable: boolean }>(url, { username });
  }

  checkEmailAvailability(email: string): Observable<{ emailIsAvailable: boolean }> {
    console.log('Auth service: Checking email availability');
    const url = `${this.host}/${this.apiVersion}/auth/checkEmailAvalability`;
    return this.http.post<{ emailIsAvailable: boolean }>(url, { email });
  }

  updateProfileInfo(profileInfo: { name?: string, lastName?: string, nameTitle?: string }): Observable<User> {
    console.log('Auth service: Updating user profile info');
    const url = `${this.host}/${this.apiVersion}/auth/user`;
    return this.http.patch<User>(url, profileInfo);
  }

  changeUsername(username: string): Observable<User> {
    console.log('Auth service: changing user username');
    const url = `${this.host}/${this.apiVersion}/auth/user/username`;
    return this.http.patch<User>(url, { username }).pipe(
      catchError((error) => {
        throw error;
      })
    );
  }

  addCoursetoShoppingCart(courseId: string, userId: string): Observable<Course> {
    console.log('Auth service: Adding course to cart');
    const url = `${this.host}/${this.apiVersion}/users/${userId}/cart/${courseId}`;
    return this.http.post<Course>(url, {});
  }

  removeCourseFromShoppingCart(courseId: string, userId: string): Observable<Course> {
    console.log('Auth service: Adding course to cart');
    const url = `${this.host}/${this.apiVersion}/users/${userId}/cart/${courseId}`;
    return this.http.delete<Course>(url, {});
  }

  addCoursesToShoppingCart(courses: Course[]): Observable<User> {
    console.log('Auth service: Adding courses to user shooping cart');
    const url = `${this.host}/${this.apiVersion}/users/me/cart/courses`;
    return this.http.post<User>(url, { courses });
  }

  purchaseCart(courses: string[], userId: string): Observable<User> {
    console.log('Auth service: Adding courses to user shooping cart');
    const url = `${this.host}/${this.apiVersion}/users/${userId}/purchasedCourses`;
    return this.http.post<User>(url, { courses });
  }

  purchaseCourse(course: string, userId: string): Observable<Course> {
    console.log('Auth service: Adding courses to user shooping cart');
    const url = `${this.host}/${this.apiVersion}/courses/${course}/purchase`;
    return this.http.post<Course>(url, {});
  }

  checkCourseAccess(courseId: string): Observable<{ canAccess: boolean }> {
    console.log('Auth service: Checking for course access');
    const url = `${this.host}/${this.apiVersion}/courses/${courseId}/access`;
    return this.http.get<{ canAccess: boolean }>(url);
  }

  completeLesson(courseId: string, lessonId: string): Observable<void> {
    console.log('Auth service: Checking for course access');
    const url = `${this.host}/${this.apiVersion}/users/complete-lesson`;
    return this.http.post<void>(url, { course: courseId, lesson: lessonId });
  }

  addCourseToFavorites(courseId: string, userId: string): Observable<User> {
    console.log('Auth service: Adding course to user favorites');
    const url = `${this.host}/${this.apiVersion}/users/${userId}/favoriteCourses/${courseId}`;
    return this.http.post<User>(url, {});
  }

  removeCourseFromFavorites(courseId: string, userId: string): Observable<User> {
    console.log('Auth service: Removing course from user favorites');
    const url = `${this.host}/${this.apiVersion}/users/${userId}/favoriteCourses/${courseId}`;
    return this.http.delete<User>(url, {});
  }

  addCourseToWishlist(courseId: string, userId: string): Observable<User> {
    console.log('Auth service: Adding course to user wishlist');
    const url = `${this.host}/${this.apiVersion}/users/${userId}/wishList/${courseId}`;
    return this.http.post<User>(url, {});
  }

  removeCourseFromWishlist(courseId: string, userId: string): Observable<User> {
    console.log('Auth service: Removing course from user wishlist');
    const url = `${this.host}/${this.apiVersion}/users/${userId}/wishList/${courseId}`;
    return this.http.delete<User>(url, {});
  }

  addCourseToArchive(courseId: string, userId: string): Observable<User> {
    console.log('Auth service: Adding course to user archive');
    const url = `${this.host}/${this.apiVersion}/users/${userId}/archivedCourses/${courseId}`;
    return this.http.post<User>(url, {});
  }

  removeCourseFromArchive(courseId: string, userId: string): Observable<User> {
    console.log('Auth service: Removing course from user archive');
    const url = `${this.host}/${this.apiVersion}/users/${userId}/archivedCourses/${courseId}`;
    return this.http.delete<User>(url, {});
  }

  resendEmailVerification(): Observable<boolean> {
    console.log('Auth service: Requesting verification email');
    const url = `${this.host}/${this.apiVersion}/auth/user/resendVerificationEmail`;
    return this.http.post<boolean>(url, {});
  }

  verifyUserEmail(userId: string, email: string, token: string): Observable<User> {
    console.log('Auth service: Validating user email');
    const url = `${this.host}/${this.apiVersion}/auth/user/verify/${userId}?email=${email}&token=${token}`;
    return this.http.get<User>(url);
  }

}
