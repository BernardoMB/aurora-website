import { Component, OnInit } from '@angular/core';
import { State } from '../../store/state';
import { Store, select } from '@ngrx/store';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { RouterOutlet, Router } from '@angular/router';
import { selectAuthUser } from '../../store/auth/auth.selectors';
import { User } from '../../shared/models/user.model';
import { LoginFormComponent } from '../login-form/login-form.component';
import { SignupFormComponent } from '../signup-form/signup-form.component';
import { logout } from '../../store/auth/auth.actions';
import { slideInAnimation } from '../../animations';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  animations: [slideInAnimation],
})
export class MainComponent implements OnInit {
  user: User;

  constructor(
    private store: Store<State>,
    private loginDialog: MatDialog,
    private signupDialog: MatDialog,
    private router: Router
  ) { }

  getAnimationData(outlet: RouterOutlet) {
    return (
      outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation
    );
  }

  ngOnInit() {
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
    /* let signupDialogRef; */
    loginDialogRef = this.loginDialog.open(LoginFormComponent, dialogConfig);
    loginDialogRef.afterClosed().subscribe(result => {
      if (result && result.showSignUpModalOnClose) {
        /* signupDialogRef = this.signupDialog.open(
          SignupFormComponent,
          dialogConfig,
        ); */
        this.onRegister();
      }
    });
  }

  onLogout() {
    // console.log('AppComponent: Dispatching logout action');
    this.store.dispatch(logout());
  }

  onRegister() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'custom-mat-dialog-container';
    dialogConfig.backdropClass = 'custom-modal-backdrop';
    /* let loginDialogRef; */
    let signupDialogRef;
    signupDialogRef = this.signupDialog.open(SignupFormComponent, dialogConfig);
    signupDialogRef.afterClosed().subscribe(result => {
      if (result && result.showLoginModalOnClose) {
        /* loginDialogRef = this.loginDialog.open(
          SignupFormComponent,
          dialogConfig,
        ); */
        this.onLogin();
      }
    });
  }

  onViewProfile() {
    console.log('MainComponent: Navigation to user profile view');
    this.router.navigate(['profile']);
  }

  onViewShoppingKart() {
    if (this.user) {
      alert('Redirect to shopping cart view');
    } else {
      this.onLogin();
    }
  }

}
