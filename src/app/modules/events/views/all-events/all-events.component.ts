import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { Event } from '../../models/event.model';
import { EventsService } from '../../services/events.service';
import { Page } from '../../../../shared/models/page.model';
import { PagedData } from '../../../../shared/models/paged-data.model';

@Component({
  selector: 'app-all-events',
  templateUrl: './all-events.component.html',
  styleUrls: ['./all-events.component.scss'],
})
export class AllEventsComponent implements OnInit, OnDestroy {
  routerSubscription: Subscription;
  events: Event[];

  // Courses pagination
  page = new Page();

  constructor(
    private eventsService: EventsService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.routerSubscription = this.router.events
      .pipe(
        filter((event) => {
          return event instanceof NavigationEnd;
        }),
      )
      .subscribe(() => {
        if (this.route.snapshot.queryParams.page) {
          const pageNumber = this.route.snapshot.queryParams.page;
          let size = 1 * 4;
          const vw = window.innerWidth; // Viewport with
          if (500 < vw && vw <= 684) {
            size = 2 * 4;
          } else if (684 < vw && vw <= 888) {
            size = 3 * 4;
          } else {
            size = 4 * 4;
          }
          this.page = this.page.copyWith({ size });
          this.setPage({ offset: pageNumber });
        } else {
          this.router.navigate(['./'], {
            relativeTo: this.route,
            queryParams: { page: 1 },
          });
        }
      });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }

  pageChanged(pageNumber: number) {
    this.page = this.page.copyWith({ pageNumber });
    this.router.navigate(['./'], {
      relativeTo: this.route,
      queryParams: { page: pageNumber },
    });
  }

  /**
   * Paging function
   * @param pageInfo The page to select
   */
  setPage(pageInfo: { offset: number }) {
    this.page = this.page.copyWith({ pageNumber: pageInfo.offset });
    this.eventsService
      .getEventsPageData(this.page)
      .subscribe((pagedData: PagedData<Event>) => {
        console.log(
          `Page number: ${pagedData.page.pageNumber}; Total pages: ${pagedData.page.totalPages}`,
        );
        this.page = pagedData.page;
      this.events = pagedData.data.toJS() as Event[];
      });
  }
}
