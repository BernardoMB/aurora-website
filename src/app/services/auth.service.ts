import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { log } from '../shared/utils';
import { User } from '../shared/models/user.model';
import { GetUserDto } from '../shared/dtos/get-user.dto';
import { SignupDto } from '../shared/dtos/signup.dto';

// TODO: standardize the use of environment variables for requests urls.
@Injectable()
export class AuthService {
  private BASE_URL = 'http://localhost:1337';

  constructor(private http: HttpClient) {}

  getStatus(): Observable<any> {
    const url = `${this.BASE_URL}/status`;
    return this.http.get<any>(url);
  }

  signin(username: string, password: string): Observable<any> {
    log('Auth service: Loging in sending credentials');
    const url = 'http://localhost:3000/v1/auth/signin';
    return this.http.post<{ accessToken: string }>(url, {
      username,
      password,
    });
  }

  getUserInfo(): Observable<GetUserDto> {
    log('Auth service: Getting user info');
    // tslint:disable-next-line: max-line-length
    const url =
      'http://localhost:3000/v1/auth/user/me?populate=purchasedCourses,favoriteCourses,wishList,likedArticlesdislikedArticles,eventSubscriptions,courses,archivedCourses';
    return this.http.get<GetUserDto>(url);
  }

  signup(signupDto: SignupDto): Observable<User> {
    // console.log('Auth service: Registering a user sending signup dto');
    log('Auth service: Registering a user sending signup dto');
    const url = 'http://localhost:3000/v1/auth/signup';
    return this.http.post<User>(url, signupDto);
  }

  signinWithToken(): Observable<any> {
    // console.log('Auth service: Loging in sending user token');
    log('Auth service: Loging in sending user token');
    const url = 'http://localhost:3000/v1/auth/signinWithToken';
    return this.http.post(url, {});
  }
}
