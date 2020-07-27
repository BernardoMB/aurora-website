import { Component, OnInit, OnDestroy } from '@angular/core';
import { Event } from '../../models/event.model';
import { EventsService } from '../../services/events.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Set } from 'immutable';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss'],
})
export class EventDetailComponent implements OnInit, OnDestroy {
  event: Event;
  relatedEvents: Event[] = [];
  sub: Subscription;
  isFavourite = true;

  constructor(
    private readonly route: ActivatedRoute,
    // private router: Router,
    // private store: Store<State>,
    // private loginDialog: MatDialog,
    // private signupDialog: MatDialog,
    // private reviewDialog: MatDialog,
    // private emailWarningDialog: MatDialog,
    // private cookieService: CookieService,
    private eventsService: EventsService,
  ) {}

  ngOnInit(): void {
    this.sub = this.route.data.subscribe(({ eventDetailInfo }) => {
      this.event = eventDetailInfo.event;
      this.relatedEvents = eventDetailInfo.relatedEvents;
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  onUnfavouriteEvent() {
    console.log('onUnfavouriteEvent');
    this.isFavourite = false;
  }

  favouriteEvent() {
    console.log('favouriteEvent');
    this.isFavourite = true;
  }
}
