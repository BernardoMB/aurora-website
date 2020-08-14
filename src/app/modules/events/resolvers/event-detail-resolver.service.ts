import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { EventsService } from '../services/events.service';
import { mergeMap, map } from 'rxjs/operators';
import { AuthService } from '../../../services/auth.service';
import { Store, select } from '@ngrx/store';
import { AuthState } from '../../../store/auth/auth.state';
import { selectAuthIsAuthenticated } from '../../../store/auth/auth.selectors';
import { PagedData } from '../../../shared/models/paged-data.model';
import { Page } from '../../../shared/models/page.model';
import { Event } from '../models/event.model';

interface EventDetailInfo {
  event: Event;
  relatedEvents: Event[];
}

/**
 * This resolver resolves the course and the related courses to course detail view.
 *
 * @export
 */
@Injectable()
export class EventDetailResolver implements Resolve<EventDetailInfo> {
  isAuthenticated: boolean;

  constructor(
    private eventsService: EventsService,
    private authService: AuthService,
    private store: Store<AuthState>,
  ) {
    this.store
      .pipe(select(selectAuthIsAuthenticated))
      .subscribe((isAuthenticated: boolean) => {
        if (isAuthenticated) {
          this.isAuthenticated = true;
        } else {
          this.isAuthenticated = false;
        }
      });
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<any> | Promise<any> | any {
    // console.log('Runing resolver');
    return this.eventsService.getEvent(route.params.id).pipe(
      mergeMap((event: Event) => {
        const page = new Page({ pageNumber: 1, size: 4 });
        return this.eventsService.getRelatedEventsPageData(page, event).pipe(
          map((relatedEventsPage: PagedData<Event>) => {
            const eventDetailInfo = {
              event,
              relatedEvents: relatedEventsPage.data.toJS(),
            };
            return eventDetailInfo;
          }),
        );
      }),
    );
  }
}
