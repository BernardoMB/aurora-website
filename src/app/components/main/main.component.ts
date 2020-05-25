import { Component, OnInit } from '@angular/core';
import { State } from '../../store/state';
import { Store, select } from '@ngrx/store';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { RouterOutlet, Router, ActivatedRoute } from '@angular/router';
import { selectAuthUser } from '../../store/auth/auth.selectors';
import { User } from '../../shared/models/user.model';
import { LoginFormComponent } from '../login-form/login-form.component';
import { SignupFormComponent } from '../signup-form/signup-form.component';
import { logout } from '../../store/auth/auth.actions';
import { slideInAnimation } from '../../animations';
import { ScrollStrategy } from '@angular/cdk/overlay';
import { AuthService } from '../../services/auth.service';
import { VerifyEmailModalComponent } from '../verify-email-modal/verify-email-modal.component';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { EmailVerifiedActionModalComponent } from '../email-verified-action-modal/email-verified-action-modal.component';

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
    private emailVerifiedCallToActionDialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private toastr: ToastrService
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

    if (
      this.route.snapshot.queryParams.emailVerification &&
      this.route.snapshot.queryParams.user &&
      this.route.snapshot.queryParams.email &&
      this.route.snapshot.queryParams.token
    ) {
      const user = this.route.snapshot.queryParams.user;
      const email = this.route.snapshot.queryParams.email;
      const token = this.route.snapshot.queryParams.token;
      if (this.user && this.user !== user) {
        console.log('DISATCHING LOGOUT ACTION');
        this.store.dispatch(logout());
      }
      this.authService.verifyUserEmail(user, email, token).pipe(
        catchError((error) => {
          this.toastr.error('Could not verify user email');
          throw error;
        })
        ).subscribe((user: User) => {
          if (user.emailVerified) {
            this.toastr.success('Thank you for verifying your email');
          }
          const dialogConfig = new MatDialogConfig();
          dialogConfig.autoFocus = true;
          dialogConfig.panelClass = 'custom-mat-dialog-container';
          dialogConfig.backdropClass = 'custom-modal-backdrop';
          dialogConfig.maxHeight = '80vh';
          let emailVerifiedActionDialogRef;
          emailVerifiedActionDialogRef = this.verifyEmailDialog.open(EmailVerifiedActionModalComponent, dialogConfig);
          emailVerifiedActionDialogRef.afterClosed().subscribe(result => {
            if (result && result.showLoginModalOnClose) {
              this.onLogin();
            }
          });
      });
    }
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
