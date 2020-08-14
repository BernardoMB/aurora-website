import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EventsComponent } from './events/events.component';
import { AllEventsComponent } from './views/all-events/all-events.component';
import { EventDetailComponent } from './views/event-detail/event-detail.component';
import { EventDetailResolver } from './resolvers/event-detail-resolver.service';
import { MyEventsComponent } from './views/my-events/my-events.component';
import { MyEventsResolver } from './resolvers/my-events.resolver.service';

const routes: Routes = [
  { path: '', component: EventsComponent },
  { path: 'all', component: AllEventsComponent },
  {
    path: 'my-events',
    component: MyEventsComponent,
    resolve: { myEventsInfo: MyEventsResolver },
  },
  {
    path: ':id',
    component: EventDetailComponent,
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    resolve: { eventDetailInfo: EventDetailResolver },
    data: { animation: 'course' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventsRoutingModule {}
