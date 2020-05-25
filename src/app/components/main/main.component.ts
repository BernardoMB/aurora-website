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
import { ScrollStrategy } from '@angular/cdk/overlay';
import { AuthService } from '../../services/auth.service';
import { VerifyEmailModalComponent } from '../verify-email-modal/verify-email-modal.component';

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
    private verifyEmailDialog: MatDialog,
    private router: Router,
    private authService: AuthService
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

    this.authService.signupIsSuccessfull$.subscribe((signupSuccessfull: boolean) => {
      if (signupSuccessfull) {
        this.signupDialog.closeAll();
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.panelClass = 'custom-mat-dialog-container';
        dialogConfig.backdropClass = 'custom-modal-backdrop';
        dialogConfig.maxHeight = '80vh';
        let verifyEmailDialogRef;
        verifyEmailDialogRef = this.verifyEmailDialog.open(VerifyEmailModalComponent, dialogConfig);
        verifyEmailDialogRef.afterClosed().subscribe(result => {
          if (result && result.showLoginModalOnClose) {
            this.onLogin();
          }
        });
      }
    });
  }

  onLogin() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'custom-mat-dialog-container';
    dialogConfig.backdropClass = 'custom-modal-backdrop';
    dialogConfig.maxHeight = '80vh';
    let loginDialogRef;
    loginDialogRef = this.loginDialog.open(LoginFormComponent, dialogConfig);
    loginDialogRef.afterClosed().subscribe(result => {
      if (result && result.showSignUpModalOnClose) {
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
    dialogConfig.maxHeight = '80vh';
    let signupDialogRef;
    signupDialogRef = this.signupDialog.open(SignupFormComponent, dialogConfig);
    signupDialogRef.afterClosed().subscribe(result => {
      if (result && result.showLoginModalOnClose) {
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
