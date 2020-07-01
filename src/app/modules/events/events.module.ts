import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventsRoutingModule } from './events-routing.module';
import { EventsComponent } from './events/events.component';
import { AllEventsComponent } from './views/all-events/all-events.component';
import { EventDetailComponent } from './views/event-detail/event-detail.component';
import { SubscriptionsComponent } from './views/subscriptions/subscriptions.component';
import { SharedModule } from '../../shared/shared.module';
import { MaterialModule } from '../../material.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgxPaginationModule } from 'ngx-pagination';
import {
  SwiperModule,
  SWIPER_CONFIG,
  SwiperConfigInterface,
} from 'ngx-swiper-wrapper';
import { EventCardComponent } from './components/event-card/event-card.component';
import { EventSwiperCardComponent } from './components/event-swiper-card/event-swiper-card.component';

const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  /* direction: 'horizontal',
  slidesPerView: 'auto' */
};
@NgModule({
  declarations: [
    EventsComponent,
    AllEventsComponent,
    EventDetailComponent,
    SubscriptionsComponent,
    EventCardComponent,
    EventSwiperCardComponent,
  ],
  imports: [
    CommonModule,
    EventsRoutingModule,
    SharedModule,
    MaterialModule,
    ScrollingModule,
    NgxPaginationModule,
    SwiperModule,
  ],
  providers: [
    {
      provide: SWIPER_CONFIG,
      useValue: DEFAULT_SWIPER_CONFIG,
    },
  ],
})
export class EventsModule {}
