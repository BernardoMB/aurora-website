import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IEvent } from '../../models/interfaces/event.interface';
import { Event } from '../../models/event.model';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss'],
})
export class EventCardComponent implements OnInit {
  @Input() set loading(val: boolean) {
    this._loading = val;
    this._valueOverriden = true;
  }
  get loading() {
    return this._loading;
  }

  @Input() event: Event;
  @Output() imageLoaded = new EventEmitter<string>();
  @Output() dateCardClicked = new EventEmitter<string>();

  private _loading = true;
  private _valueOverriden = false;
  constructor() {}

  ngOnInit(): void {}

  onHandleClick(e) {
    console.log(e);
    e?.preventDefault();
    e?.stopPropagation();
    this.dateCardClicked.next(this.event?.id ?? undefined);
  }

  onHandleImageLoaded(e) {
    console.log(e);
    this.imageLoaded.next();
    this.loading = this._valueOverriden ? this.loading : false;
  }
}
