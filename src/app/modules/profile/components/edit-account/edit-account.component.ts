import { Component, OnInit } from '@angular/core';
import { User } from '../../../../shared/models/user.model';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { AuthState } from '../../../../store/auth/auth.state';
import { selectAuthUser } from '../../../../store/auth/auth.selectors';
import { changeUserPassword } from '../../../../store/auth/auth.actions';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.component.html',
  styleUrls: ['./edit-account.component.scss']
})
export class EditAccountComponent implements OnInit {
  user: User;
  userSubscription: Subscription;
  usernameControl = new FormControl('', [
    (control: AbstractControl): {[key: string]: any} | null => {
      /* if (!this.user) {
        return { usernameNotChanged: { errorMessage: 'Username not changed'} };
      }
      if (control.value !== this.user.username) {
        return null;
      }
      return { usernameNotChanged: { errorMessage: 'Username not changed'} }; */
      return null;
    }
  ]);
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
    private store: Store<AuthState>, // Change user state
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

    const newPasswordControl = this.resetPasswordForm.get('newPasswordControl');
    const retypeNewPasswordControl = this.resetPasswordForm.get('retypeNewPasswordControl');
    newPasswordControl.valueChanges.subscribe(value => {
      // console.log('Value', value);
      // console.log('Status', newPasswordControl.status);
      if (newPasswordControl.status === 'VALID') {
        retypeNewPasswordControl.enable();
      } else {
        retypeNewPasswordControl.disable();
      }
    });
    const currentPasswordControl = this.resetPasswordForm.get('currentPasswordControl');
    currentPasswordControl.valueChanges.subscribe(value => {
      // console.log('Value', value);
      // console.log('Status', newPasswordControl.status);
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

  validateNewPasswordControl() {
    const currentPasswordControl = this.resetPasswordForm.get('currentPasswordControl');
    const newPasswordControl = this.resetPasswordForm.get('newPasswordControl');
    if (newPasswordControl.value === currentPasswordControl.value) {
      newPasswordControl.setErrors({ newPassError: { errorMessage: 'Your new password must be different from the current password.' }});
      this.resetPasswordForm.get('retypeNewPasswordControl').disable();
    }
  }

  onUpdateUsername() {
    if (!this.usernameFieldIsValid) {
      console.log('Username field is not valid');
      return;
    }
    console.log('Username field is valid');
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

  onUpdateEmail() {
    // TODO: Dispatch update username
  }

  /**
   * This function is called when the user wants to verify his unverified email
   */
  onSendEmailAgain() {
    // TODO: Call server to verify email
  }

  onSubmit() {
    if (!this.isValid) {
      // console.log('From is not valid');
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
