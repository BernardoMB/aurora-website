import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { log } from '../shared/utils';
import { User } from '../shared/models/user.model';
import { GetUserDto } from '../shared/dtos/get-user.dto';

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
        // console.log('Auth service: Loging in sending credentials.');
        log('Auth service: Loging in sending credentials.');
        const url = 'http://localhost:3000/v1/auth/signin';
        return this.http.post<{ accessToken: string }>(url, {
            username,
            password,
        });
        // TODO: store access token cookie.
    }

    getUserInfo(): Observable<GetUserDto> {
        // console.log('Auth service: Getting user info.');
        log('Auth service: Getting user info.');
        const url = 'http://localhost:3000/v1/auth/user/me';
        return this.http.get<GetUserDto>(url);
    }

    // TODO: modify
    signUp(email: string, password: string): Observable<User> {
        // console.log('Auth service: Registering a user sending credentials.');
        log('Auth service: Registering a user sending credentials.');
        const url = `${this.BASE_URL}/register`;
        return this.http.post<User>(url, { email, password });
    }

    // TODO: modify
    logInWithToken(refreshToken: string): Observable<any> {
        // console.log('Auth service: Loging in sending refresh token', refreshToken);
        log('Auth service: Loging in sending refresh token', refreshToken);
        const url =
            'https://securetoken.googleapis.com/v1/token?key=AIzaSyBjT3l5WX5CDzuQVAuGJufsBFNOq9R1FiQ';
        return this.http.post(url, {
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
        });
    }
}
