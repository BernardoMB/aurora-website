import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { slideInAnimation } from './animations';
import { CookieService } from 'ngx-cookie-service';
import { Store, select } from '@ngrx/store';
import { login, loginWithToken, logout } from './store/auth/auth.actions';
import { log } from './shared/utils';
import { User } from './shared/models/user.model';
import { selectAuthUser } from './store/auth/auth.selectors';
import { State } from './store/state';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    animations: [slideInAnimation],
})
export class AppComponent implements OnInit {
    user: User;

    constructor(
        private cookieService: CookieService,
        private store: Store<State>,
    ) {}

    getAnimationData(outlet: RouterOutlet) {
        return (
            outlet &&
            outlet.activatedRouteData &&
            outlet.activatedRouteData.animation
        );
    }

    ngOnInit() {
        const token = this.cookieService.get('userToken');
        if (token) {
            log('AppComponent: User token found! Dispatching login action');
            this.store.dispatch(loginWithToken());
        }

        this.store.pipe(select(selectAuthUser)).subscribe((user: User) => {
            if (user) {
                this.user = user;
            } else {
                this.user = undefined;
            }
        });
    }

    onLogin() {
        // ! Login modal
        // TODO: Open login modal.
        console.log('Should open login modal');
        log('AppComponent: Dispatching login action');
        this.store.dispatch(
            login({ username: 'kevinislas', password: 'Qawsed123' }),
        );
    }

    onLogout() {
        log('AppComponent: Dispatching logout action');
        this.store.dispatch(logout());
    }

    onRegister() {
        // TODO: Open register modal.
        console.log('Should open register modal');
    }
}
