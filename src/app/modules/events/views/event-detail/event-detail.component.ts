import { Component, OnInit, OnDestroy } from '@angular/core';
import { Event } from '../../models/event.model';
import { EventsService } from '../../services/events.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription, Observable, of, from } from 'rxjs';
import { Set } from 'immutable';
import { Store, select } from '@ngrx/store';
import { State } from '../../../../store/state';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { User } from '../../../../shared/models/user.model';
import { LoginFormComponent } from '../../../../components/login-form/login-form.component';
import { switchMap } from 'rxjs/operators';
import { SignupFormComponent } from '../../../../components/signup-form/signup-form.component';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import {
  subscribeToEvent,
  unsubscribeFromEvent,
} from '../../../../store/auth/auth.actions';
import {
  selectAuthUser,
  selectAuthIsAuthenticated,
} from '../../../../store/auth/auth.selectors';

interface Coordinates {
  latitude: number;
  longitude: number;
}

@UntilDestroy({ arrayName: 'subscriptions' })
@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss'],
})
export class EventDetailComponent implements OnInit, OnDestroy {
  event: Event;
  relatedEvents: Event[] = [];
  subscriptions: Subscription[] = [];
  location: Coordinates;
  isFavourite = true;
  user: User;

  get isSubscribed() {
    return (
      !!this.user && this.user.eventSubscriptions.indexOf(this.event.id) >= 0
    );
  }

  get googleMapsUrl() {
    return !!this.location
      ? `https://www.google.com/maps/dir/${this.location.latitude},${this.location.longitude}/${this.event.location.coordinates[1]},${this.event.location.coordinates[0]}/@${this.location.latitude},${this.location.longitude}z`
      : `https://www.google.com/maps/@${this.event.location.coordinates[1]},${this.event.location.coordinates[0]}z`;
  }

  constructor(
    private readonly route: ActivatedRoute,
    private store: Store<State>,
    private dialog: MatDialog,
    private eventsService: EventsService,
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.route.data.subscribe(({ eventDetailInfo }) => {
        this.event = eventDetailInfo.event;
        this.relatedEvents = eventDetailInfo.relatedEvents;
      }),
      this.store.pipe(select(selectAuthUser)).subscribe((user) => {
        this.user = user;
      }),
      from(this.getPosition()).subscribe((location) => {
        this.location = location;
        console.log(this.location);
      }),
    );
  }

  ngOnDestroy(): void {}

  onUnfavouriteEvent() {
    console.log('onUnfavouriteEvent');
    this.isFavourite = false;
  }

  favouriteEvent() {
    console.log('favouriteEvent');
    this.isFavourite = true;
  }

  onOpenLoginModal() {
    const dialogConfig: MatDialogConfig = {
      autoFocus: true,
      panelClass: 'custom-mat-dialog-container',
      backdropClass: 'custom-modal-backdrop',
      maxHeight: '80vh',
    };
    this.dialog
      .open(LoginFormComponent, dialogConfig)
      .afterClosed()
      .pipe(
        switchMap((result) => {
          if (result.showSignUpModalOnClose) {
            return this.dialog
              .open(SignupFormComponent, dialogConfig)
              .afterClosed();
          }
          return of(undefined);
        }),
        untilDestroyed(this),
      )
      .subscribe(console.log);
  }

  onSubscribeToEvent(): void {
    this.eventsService
      .subscribeToEvent(this.event.id)
      .pipe(untilDestroyed(this))
      .subscribe((updatedEvent) => {
        this.event = updatedEvent;
        this.store.dispatch(subscribeToEvent({ eventId: updatedEvent.id }));
      });
  }

  onUnsubscribeFromEvent(): void {
    this.eventsService
      .unSubscribeFromEvent(this.event.id)
      .pipe(untilDestroyed(this))
      .subscribe((updatedEvent) => {
        this.event = updatedEvent;
        this.store.dispatch(unsubscribeFromEvent({ eventId: updatedEvent.id }));
      });
  }

  getPosition(): Promise<Coordinates> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (resp) => {
          resolve({
            longitude: resp.coords.longitude,
            latitude: resp.coords.latitude,
          });
        },
        (err) => {
          reject(err);
        },
      );
    });
  }
}
