import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Store, select } from '@ngrx/store';
import { loginWithToken } from './store/auth/auth.actions';
import { log } from './shared/utils';
import { User } from './shared/models/user.model';
import { selectAuthUser } from './store/auth/auth.selectors';
import { State } from './store/state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  user: User;

  constructor(
    private cookieService: CookieService,
    private store: Store<State>
  ) {}

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
}
