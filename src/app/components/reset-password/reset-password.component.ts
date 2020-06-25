import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, NavigationEnd, Event, ActivatedRoute } from '@angular/router';
import { filter, catchError } from 'rxjs/operators';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  routerSubscription: Subscription;
  token: string;

  resetPasswordForm = new FormGroup({
    newPasswordControl: new FormControl('', [
      Validators.pattern(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/),
      (control: AbstractControl): {[key: string]: any} | null => {
        const regularExpresion = /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
        const match = regularExpresion.test(control.value);
        if (!match) {
          return { noMatchRegex: { errorMessage: 'Password must contain special characters, upper case and lower case letters.' }};
        }
        return null;
      }
    ]),
    retypeNewPasswordControl: new FormControl({value: '', disabled: true}, [
      Validators.pattern(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/),
      (control: AbstractControl): {[key: string]: any} | null => {
        const password = this.resetPasswordForm.get('newPasswordControl').value;
        const value = control.value;
        let isValid = false;
        if (password === value) {
          isValid = true;
        }
        return isValid ? null : { passwordsMustBeEqual: {value: control.value, errorMessage: 'Your new password must match.'}};
      }
    ]),
  }, {
    validators: (control: FormGroup): ValidationErrors | null => {
      // control is the form group
      const isValid =
        control.touched &&
        control.get('newPasswordControl').value !== '' &&
        control.get('retypeNewPasswordControl').value !== '';
      return isValid ? null : { anyValue: true };
    }
  });
  get isValid(): boolean {
    return this.resetPasswordForm.valid && this.resetPasswordForm.touched;
  }
  hide = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private toastrService: ToastrService
  ) {
    this.routerSubscription = this.router.events.pipe(
      filter((event: Event) => {
        return event instanceof NavigationEnd;
      })
    ).subscribe((event: NavigationEnd) => {
      if (this.route.snapshot.queryParams && this.route.snapshot.queryParams.email) {
        this.token = this.route.snapshot.queryParams.email;

      } else {
        this.router.navigate(['/']);
      }
    });
  }

  ngOnInit(): void {
    const newPasswordControl = this.resetPasswordForm.get('newPasswordControl');
    const retypeNewPasswordControl = this.resetPasswordForm.get('retypeNewPasswordControl');
    newPasswordControl.valueChanges.subscribe(value => {
      if (newPasswordControl.status === 'VALID') {
        retypeNewPasswordControl.enable();
      } else {
        retypeNewPasswordControl.disable();
      }
    });
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }

  onSubmit() {
    if (!this.isValid) {
      return;
    }
    const changePasswordWithTokenDto = {
      token: this.token,
      newPassword: this.resetPasswordForm.get('newPasswordControl').value,
      newPasswordConfirmation: this.resetPasswordForm.get('retypeNewPasswordControl').value
    };
    // TODO: Call change user password with token function in auth service.
    this.authService.changeUserPasswordWithToken(
      changePasswordWithTokenDto.token,
      changePasswordWithTokenDto.newPassword,
      changePasswordWithTokenDto.newPasswordConfirmation
    ).pipe(
      catchError((error) => {
        console.log('Error', error.error);
        if (error.status === 401 && error.error.errorCode === '4011') {
          this.toastrService.error('Reset password link expired', 'Request another link');
        }
        throw error;
      })
    ).subscribe(() => {
      this.toastrService.success('Please log in', 'Password changed');
      console.log('ResetPasswordModalComponent: Password was changed. Redirecting user to /');
      this.router.navigate(['/']);
    });
  }

}
