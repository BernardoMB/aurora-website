import { Component, OnInit } from '@angular/core';
import { User } from '../../../../shared/models/user.model';
import { Subscription, interval } from 'rxjs';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { AuthState } from '../../../../store/auth/auth.state';
import { selectAuthUser } from '../../../../store/auth/auth.selectors';
import { changeUserPassword, changeUsername } from '../../../../store/auth/auth.actions';
import { AuthService } from '../../../../services/auth.service';
import { throttle } from 'rxjs/operators';

@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.component.html',
  styleUrls: ['./edit-account.component.scss']
})
export class EditAccountComponent implements OnInit {
  throttlingTime = 1000; // Miliseconds
  user: User;
  userSubscription: Subscription;
  usernameControl = new FormControl('');
  emailControl = new FormControl('', [Validators.email]);
  resetPasswordForm = new FormGroup({
    currentPasswordControl: new FormControl(''),
    newPasswordControl: new FormControl('', [
      Validators.pattern(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/),
      (control: AbstractControl): {[key: string]: any} | null => {
        const regularExpresion = /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
        const match = regularExpresion.test(control.value);
        if (!match) {
          return { noMatchRegex: { errorMessage: 'Password must contain special characters, upper case and lower case letters.' }};
        }
        const currentPasswordControl = this.resetPasswordForm.get('currentPasswordControl');
        if (control.value === currentPasswordControl.value) {
          return { newPassError: { errorMessage: 'Your new password must be different from the current password.' }};
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
        control.get('currentPasswordControl').value !== '' &&
        control.get('newPasswordControl').value !== '' &&
        control.get('retypeNewPasswordControl').value !== '';
      return isValid ? null : { anyValue: true };
    }
  });
  get usernameFieldIsValid(): boolean {
    if (!this.user) {
      return false;
    }
    const valid = this.usernameControl.value !== this.user.username;
    return this.usernameControl.valid && valid;
  }
  get isValid(): boolean {
    return this.resetPasswordForm.valid && this.resetPasswordForm.touched;
  }
  hide = true;
  showVerifyEmailWarning = false;

  constructor(
    private store: Store<AuthState>,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.userSubscription = this.store.pipe(select(selectAuthUser)).subscribe((user: User) => {
      if (user) {
        this.user = user;
        this.usernameControl.setValue(this.user.username);
        this.emailControl.setValue(this.user.email);
        if (!this.user.emailVerified) {
          this.showVerifyEmailWarning = true;
        }
      }
    });

    // * Username
    const usernameControl = this.usernameControl;
    usernameControl.valueChanges.pipe(
      throttle(ev => interval(this.throttlingTime))
    ).subscribe((value) => {
      // console.log(value);
      this.checkUsernameAvailability();
    });

    const newPasswordControl = this.resetPasswordForm.get('newPasswordControl');
    const retypeNewPasswordControl = this.resetPasswordForm.get('retypeNewPasswordControl');
    newPasswordControl.valueChanges.subscribe(value => {
      if (newPasswordControl.status === 'VALID') {
        retypeNewPasswordControl.enable();
      } else {
        retypeNewPasswordControl.disable();
      }
    });
    const currentPasswordControl = this.resetPasswordForm.get('currentPasswordControl');
    currentPasswordControl.valueChanges.subscribe(value => {
      if (currentPasswordControl.value !== newPasswordControl.value) {
        newPasswordControl.setErrors(null);
        retypeNewPasswordControl.enable();
      }
      if (currentPasswordControl.value === newPasswordControl.value) {
        newPasswordControl.setErrors({ newPassError: { errorMessage: 'Your new password must be different from the current password.' }});
        this.resetPasswordForm.get('retypeNewPasswordControl').disable();
      }
    });

    this.authService.emptyResetPasswordForm$.subscribe((resetForm: boolean) => {
      if (resetForm) {
        this.resetPasswordForm.reset();
        this.resetPasswordForm.setErrors(null);
        this.resetPasswordForm.get('newPasswordControl').setErrors(null);
      }
    });
  }

  // * Username

  onUpdateUsername() {
    if (!this.usernameFieldIsValid) {
      return;
    }
    this.store.dispatch(changeUsername({ username: this.usernameControl.value }));
  }

  public get getUpdateUsernameButtonStyles(): any {
    if (this.usernameFieldIsValid) {
      return {
        'background-color': '#e56e00',
        color: 'white',
        cursor: 'pointer'
      };
    } else {
      return {
        'background-color': 'gainsboro',
        color: 'grey',
        cursor: 'no-drop'
      };
    }
  }

  checkUsernameAvailability() {
    const usernameControl = this.usernameControl;
    const username  = usernameControl.value;
    if (username && username !== this.user.username) {
      this.authService.checkUsernameAvailability(username).subscribe((res: { usernameIsAvailable: boolean }) => {
        if (!res.usernameIsAvailable) {
          // console.log('usernamer is not available ): ');
          usernameControl.setErrors({ notAvailable: { errorMessage: 'Username is not available' }});
        } else {
          // console.log('usernamer is available (:');
        }
      });
    }
  }

  // * Email

  onUpdateEmail() {
    // TODO: Dispatch update email action
  }

  /**
   * This function is called when the user wants to verify his unverified email
   */
  onSendEmailAgain() {
    // TODO: Call server to verify email
  }

  onOpenEditEmailModal() {}

  checkEmailAvailability() {
    // TODO: This function should go inside the change email modal (functionality yet to be implemented)
    const emailControl = this.emailControl;
    const email  = emailControl.value;
    if (email) {
      this.authService.checkEmailAvailability(email).subscribe((res: { emailIsAvailable: boolean }) => {
        if (!res.emailIsAvailable) {
          // console.log('email is not available ): ');
          emailControl.setErrors({ notAvailable: { errorMessage: 'Email is not available' }});
        } else {
          // console.log('email is available (:');
        }
      });
    }
  }

  // * Password

  validateNewPasswordControl() {
    const currentPasswordControl = this.resetPasswordForm.get('currentPasswordControl');
    const newPasswordControl = this.resetPasswordForm.get('newPasswordControl');
    if (newPasswordControl.value === currentPasswordControl.value) {
      newPasswordControl.setErrors({ newPassError: { errorMessage: 'Your new password must be different from the current password.' }});
      this.resetPasswordForm.get('retypeNewPasswordControl').disable();
    }
  }

  onSubmit() {
    if (!this.isValid) {
      return;
    }
    const changePasswordDto = {
      password: this.resetPasswordForm.get('currentPasswordControl').value,
      newPassword: this.resetPasswordForm.get('newPasswordControl').value,
      newPasswordConfirmation: this.resetPasswordForm.get('retypeNewPasswordControl').value
    };
    this.store.dispatch(changeUserPassword({...changePasswordDto}));
  }

}
