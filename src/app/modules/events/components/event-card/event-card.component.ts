import { Component, OnInit, Input } from '@angular/core';
import { Event } from '../../models/event.model';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss'],
})
export class EventCardComponent implements OnInit {
  @Input() event: Event;

  isLoading = true;

  constructor() {}

  ngOnInit(): void {}

  onHandleClick(e) {
    console.log(e);
    e?.preventDefault();
    e?.stopPropagation();
  }

  onHandleImageLoaded(e) {
    console.log(e);
    const values = Object.values(e);
    const keys = Object.keys(e);
    console.table([
      ['Key', 'Value'],
      Object.keys(e).map((val: any, index) => []),
    ]);
    setTimeout(() => {
      // this.isLoading = false;
    }, 5000);
  }
}
