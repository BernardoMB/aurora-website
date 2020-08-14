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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import {
  SwiperModule,
  SWIPER_CONFIG,
  SwiperConfigInterface,
} from 'ngx-swiper-wrapper';
import { EventCardComponent } from './components/event-card/event-card.component';
import { EventSwiperCardComponent } from './components/event-swiper-card/event-swiper-card.component';
import { EventDetailResolver } from './resolvers/event-detail-resolver.service';
import { MyEventsComponent } from './views/my-events/my-events.component';
import { MyEventsResolver } from './resolvers/my-events.resolver.service';

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
    MyEventsComponent,
  ],
  imports: [
    CommonModule,
    EventsRoutingModule,
    SharedModule,
    MaterialModule,
    ScrollingModule,
    NgxPaginationModule,
    MatProgressSpinnerModule,
    SwiperModule,
  ],
  providers: [
    EventDetailResolver,
    MyEventsResolver,
    {
      provide: SWIPER_CONFIG,
      useValue: DEFAULT_SWIPER_CONFIG,
    },
  ],
})
export class EventsModule {}
