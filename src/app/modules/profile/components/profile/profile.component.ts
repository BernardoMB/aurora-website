import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AuthState } from '../../../../store/auth/auth.state';
import { User } from '../../../../shared/models/user.model';
import { Subscription } from 'rxjs';
import { selectAuthUser } from '../../../../store/auth/auth.selectors';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: User;
  userSubscription: Subscription;

  constructor(
    private store: Store<AuthState>
  ) { }

  ngOnInit() {
    this.userSubscription = this.store.pipe(select(selectAuthUser)).subscribe((user: User) => {
      if (user) {
        this.user = user;
      }
    });
  }

}
