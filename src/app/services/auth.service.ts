import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../shared/models/user.model';
import { GetUserDto } from '../shared/dtos/get-user.dto';
import { SignupDto } from '../shared/dtos/signup.dto';
import { environment } from '../../environments/environment';
import { Course } from '../shared/models/course.model';

// TODO: standardize the use of environment variables for requests urls.
@Injectable()
export class AuthService {
  private BASE_URL = 'http://localhost:1337';
  host = environment.host;
  apiVersion = environment.apiVersion;

  constructor(private http: HttpClient) {}

  getStatus(): Observable<any> {
    const url = `${this.BASE_URL}/status`;
    return this.http.get<any>(url);
  }

  signin(username: string, password: string): Observable<any> {
    console.log('Auth service: Loging in sending credentials');
    // this.host = `https://mainserver.azurewebsites.net`; // TODO: delete this line
    const url = `${this.host}/${this.apiVersion}/auth/signin`;
    return this.http.post<{ accessToken: string }>(url, {
      username,
      password,
    });
  }

  getUserInfo(): Observable<GetUserDto> {
    console.log('Auth service: Getting user info');
    // this.host = `https://mainserver.azurewebsites.net`; // TODO: delete this line
    const url =
    // tslint:disable-next-line: max-line-length
    `${this.host}/${this.apiVersion}/auth/user/me?populate=purchasedCourses,favoriteCourses,wishList,likedArticlesdislikedArticles,eventSubscriptions,courses,archivedCourses`;
    return this.http.get<GetUserDto>(url);
  }

  signup(signupDto: SignupDto): Observable<User> {
    console.log('Auth service: Registering a user sending signup dto');
    // this.host = `https://mainserver.azurewebsites.net`; // TODO: delete this line
    const url = 'http://localhost:3000/v1/auth/signup';
    return this.http.post<User>(url, signupDto);
  }

  signinWithToken(): Observable<any> {
    console.log('Auth service: Loging in sending user token');
    // this.host = `https://mainserver.azurewebsites.net`; // TODO: delete this line
    const url = 'http://localhost:3000/v1/auth/signinWithToken';
    return this.http.post(url, {});
  }

  addCoursetoShoppingCart(courseId: string, userId: string): Observable<Course> {
    console.log('Auth service: Adding course to cart');
    // this.host = `https://mainserver.azurewebsites.net`; // TODO: delete this line
    const url = `http://localhost:3000/v1/users/${userId}/cart/${courseId}`;
    return this.http.post<Course>(url, {});
  }

  removeCourseFromShoppingCart(courseId: string, userId: string): Observable<Course> {
    console.log('Auth service: Adding course to cart');
    // this.host = `https://mainserver.azurewebsites.net`; // TODO: delete this line
    const url = `http://localhost:3000/v1/users/${userId}/cart/${courseId}`;
    return this.http.delete<Course>(url, {});
  }

  addCoursesToShoppingCart(courses: Course[]): Observable<User> {
    console.log('Auth service: Adding courses to user shooping cart');
    // this.host = `https://mainserver.azurewebsites.net`; // TODO: delete this line
    const url = `http://localhost:3000/v1/users/me/cart/courses`;
    return this.http.post<User>(url, { courses });
  }
}
