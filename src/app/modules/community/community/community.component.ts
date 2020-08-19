import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { User } from '../../../shared/models/user.model';
import { Subscription } from 'rxjs';
import { ReactionsService } from '../services/reactions.service';
import { State } from '../../../store/state';
import { MatDialog } from '@angular/material/dialog';
import { Reaction } from '../models/community-interaction';
import { selectAuthUser } from '../../../store/auth/auth.selectors';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.scss'],
})
export class CommunityComponent implements OnInit {
  user: User;
  subscriptions: Subscription[] = [];
  reactions: Reaction[] = [];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly store: Store<State>,
    private readonly reactionsService: ReactionsService,
    private readonly dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.route.data.subscribe(({ reactions }: { reactions: Reaction[] }) => {
        console.log(reactions);
        this.reactions = reactions;
      }),
      this.store.pipe(select(selectAuthUser)).subscribe((user) => {
        this.user = user;
      }),
    );
  }
}
