import { Component, OnInit, Input } from '@angular/core';
import { IEvent } from '../../models/interfaces/event.interface';

@Component({
  selector: 'app-event-swiper-card',
  templateUrl: './event-swiper-card.component.html',
  styleUrls: ['./event-swiper-card.component.scss'],
})
export class EventSwiperCardComponent implements OnInit {
  @Input() event: IEvent;

  constructor() {}

  ngOnInit(): void {}
}
