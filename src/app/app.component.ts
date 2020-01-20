import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { slideInAnimation } from './animations';
import { CookieService } from 'ngx-cookie-service';
import { Store, select } from '@ngrx/store';
import { loginWithToken, logout } from './store/auth/auth.actions';
import { log } from './shared/utils';
import { User } from './shared/models/user.model';
import { selectAuthUser } from './store/auth/auth.selectors';
import { State } from './store/state';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { SignupFormComponent } from './components/signup-form/signup-form.component';

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
    private loginDialog: MatDialog,
    private signupDialog: MatDialog,
  ) {}

  getAnimationData(outlet: RouterOutlet) {
    return (
      outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation
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
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'custom-mat-dialog-container';
    dialogConfig.backdropClass = 'custom-modal-backdrop';
    let loginDialogRef;
    let signupDialogRef;
    loginDialogRef = this.loginDialog.open(LoginFormComponent, dialogConfig);
    loginDialogRef.afterClosed().subscribe(result => {
      if (result && result.showSignUpModalOnClose) {
        signupDialogRef = this.signupDialog.open(
          SignupFormComponent,
          dialogConfig,
        );
      }
    });
  }

  onLogout() {
    log('AppComponent: Dispatching logout action');
    this.store.dispatch(logout());
  }

  onRegister() {
    // TODO: Open register modal.
    console.log('Should open register modal');
  }

  onViewProfile() {
    alert('implement this function');
  }

  onViewShoppingKart() {
    if (this.user) {
      alert('Redirect to shopping cart view');
    } else {
      this.onLogin();
    }
  }
}
