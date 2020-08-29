import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy({ arrayName: 'subscriptions' })
@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.scss'],
})
export class MyEventsComponent implements OnInit, OnDestroy {
  events: Event[];
  subscriptions: Subscription[] = [];

  constructor(
    private readonly route: ActivatedRoute, // private store: Store<State>,
  ) // private dialog: MatDialog,
  // private eventsService: EventsService,
  {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.route.data.subscribe(({ myEventsInfo }) => {
        this.events = myEventsInfo.events;
      }),
    );
  }

  ngOnDestroy() {}
}
