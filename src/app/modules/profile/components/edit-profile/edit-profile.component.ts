import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidationErrors } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { AuthState } from '../../../../store/auth/auth.state';
import { User } from '../../../../shared/models/user.model';
import { selectAuthUser } from '../../../../store/auth/auth.selectors';
import { Subscription } from 'rxjs';
import { updateProfileInfo } from '../../../../store/auth/auth.actions';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  user: User;
  userSubscription: Subscription;
  profileInfoForm = new FormGroup({
    nameControl: new FormControl(''),
    lastNameControl: new FormControl(''),
    nameTitleControl: new FormControl(''),
  }, {
    validators: (control: FormGroup): ValidationErrors | null => {
      if (!this.user) {
        return { anyValue: true };
      }
      const anyValueChanged =
        control.get('nameControl').value !== this.user.name ||
        control.get('lastNameControl').value !== this.user.lastName ||
        control.get('nameTitleControl').value !== this.user.nameTitle;
      const isValid = this.profileInfoForm.touched && anyValueChanged;
      return isValid ? null : { anyValue: true };
    }
  });
  get isValid(): boolean {
    return this.profileInfoForm.valid && this.profileInfoForm.touched;
  }


  constructor(
    private store: Store<AuthState>, // Change user state
  ) { }

  ngOnInit() {
    this.userSubscription = this.store.pipe(select(selectAuthUser)).subscribe((user: User) => {
      if (user) {
        this.user = user;
        this.profileInfoForm.setValue({
          nameControl: this.user.name,
          lastNameControl: this.user.lastName,
          nameTitleControl: this.user.nameTitle
        })
      }
    });
  }

  onSubmit() {
    if (!this.isValid) {
      console.log('From is not valid');
      return;
    }
    const profileInfo = {
      name: this.profileInfoForm.value.nameControl,
      lastName: this.profileInfoForm.value.lastNameControl,
      nameTitle: this.profileInfoForm.value.nameTitle
    };
    this.store.dispatch(updateProfileInfo({ profileInfo, userId: this.user.id }));
  }

}
