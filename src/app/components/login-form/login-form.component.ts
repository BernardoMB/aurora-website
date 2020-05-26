import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { State } from '../../store/state';
import { selectAuthState } from '../../store/auth/auth.selectors';
import { login } from '../../store/auth/auth.actions';

export interface ILoginModel {
  username: string;
  password: string;
}

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent implements OnInit {
  email = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);
  loginForm = new FormGroup({
    email: this.email,
    password: this.password,
  });
  getAuthState: Observable<any>;
  errorMessage: string | null;
  get isValid(): boolean {
    return this.loginForm.valid && !this.loginForm.pristine;
  }
  hide = true;

  constructor(
    private store: Store<State>,
    public dialogRef: MatDialogRef<LoginFormComponent>,
  ) {
    this.getAuthState = this.store.pipe(select(selectAuthState));
  }

  ngOnInit() {
    this.getAuthState.subscribe(state => {
      this.errorMessage = state.errorMessage;
      if (state.user) {
        // Close modal
        this.dialogRef.close({ userIsLoggedIn: true });
      }
    });
  }

  onSubmit(): void {
    if (!this.isValid) {
      return;
    }
    const credentials: ILoginModel = {
      // User can input both username or email
      username: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };
    this.store.dispatch(login(credentials));
  }

  onClose() {
    this.loginForm.reset();
    // Close modal
    this.dialogRef.close();
  }
}
