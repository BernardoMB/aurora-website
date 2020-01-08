import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { slideInAnimation } from './animations';
import { CookieService } from 'ngx-cookie-service';
import { Store } from '@ngrx/store';
import { AuthState } from './store/auth/auth.state';
import { login } from './store/auth/auth.actions';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    animations: [slideInAnimation],
})
export class AppComponent implements OnInit {
    title = 'aurora-website';

    constructor(
        private cookieService: CookieService,
        private store: Store<AuthState>,
    ) {}

    getAnimationData(outlet: RouterOutlet) {
        return (
            outlet &&
            outlet.activatedRouteData &&
            outlet.activatedRouteData.animation
        );
    }

    ngOnInit() {
        const token = this.cookieService.get('token');
        if (token) {
            // TODO: Dispatch login attempt.
        }

        // TODO: Subscribe to the user in property of the authentication state.
        // TODO: If the authentication state changes and there is a user, then pass
        // TODO: the user to the application header so it changes its behavior given that theres is a logged in user.
    }

    onLogin() {
        // TODO: Open login modal.
        console.log('Should open login modal');
        this.store.dispatch(
            login({ username: 'kevinislas', password: 'Qawsed-123' }),
        );
    }

    onRegister() {
        // TODO: Open register modal.
        console.log('Should open register modal');
    }
}
