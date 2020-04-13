import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../shared/models/user.model';
import { SignupDto } from '../shared/dtos/signup.dto';
import { environment } from '../../environments/environment';
import { Course } from '../shared/models/course.model';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuthService {
  host = environment.host;
  apiVersion = environment.apiVersion;

  constructor(private http: HttpClient) {}

  getStatus(): Observable<any> {
    const url = `${this.host}/status`;
    return this.http.get<any>(url);
  }

  signup(signupDto: SignupDto): Observable<User> {
    console.log('Auth service: Registering a user sending signup dto');
    const url = `${this.host}/${this.apiVersion}/auth/signup`;
    return this.http.post<User>(url, signupDto);
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

  signinWithToken(): Observable<any> {
    console.log('Auth service: Loging in sending user token');
    const url = `${this.host}/${this.apiVersion}/auth/signinWithToken`;
    return this.http.post(url, {});
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

}
