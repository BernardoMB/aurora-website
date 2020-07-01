import { Component, OnInit, Input } from '@angular/core';
import { Event } from '../../models/event.model';

@Component({
  selector: 'app-event-swiper-card',
  templateUrl: './event-swiper-card.component.html',
  styleUrls: ['./event-swiper-card.component.scss'],
})
export class EventSwiperCardComponent implements OnInit {
  @Input() event: Event;

  constructor() {}

  ngOnInit(): void {}
}
