import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { AuthState } from '../../../store/auth/auth.state';
import { Event } from '../models/event.model';
import { Store } from '@ngrx/store';
import { SwiperConfigInterface, SwiperDirective } from 'ngx-swiper-wrapper';
import { Subscription } from 'rxjs';
import { selectAuthIsAuthenticated } from '../../../store/auth/auth.selectors';
import { EventsService } from '../services/events.service';
import { Page } from '../../../shared/models/page.model';
import { PagedData } from '../../../shared/models/paged-data.model';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EventsComponent implements OnInit {
  isAuthenticatedSubscription: Subscription;
  isAuthenticated: boolean;

  // Sliders configuration
  @ViewChildren(SwiperDirective) swiperDirective: QueryList<SwiperDirective>;
  config: SwiperConfigInterface = {
    initialSlide: 0, // Slide Index Starting from 0
    slidesPerView: 1.5,
    spaceBetween: 15, // Pixels between each slide
    breakpoints: {
      500: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      700: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
      1020: {
        slidesPerView: 4,
        spaceBetween: 40,
      },
    },
    scrollbar: {
      el: '.swiper-scrollbar',
      hide: true,
    },
  };

  // Featured events pagination
  upcomingEvents: Event[] = [];
  upcomingEventsPage = new Page({ size: 4, pageNumber: 1 });
  showPrevBubtton = false;
  showNextButton = true;
  featuredReachedEnd = false;
  index = 0;
  lastIndex = 0;

  //Paginated
  maxPaginationElements = 3;

  // Recent events pagination
  recentEvents: Event[];
  recentEventsPage = new Page();

  // Recent events pagination
  closeByEvents: Event[];
  closeByEventsPage = new Page();

  // Trending events pagination
  trendingEvents: Event[] = [];
  trendingEventsPage = new Page({ size: 4 });
  showPrevBubttonTrending = false;
  showNextButtonTrending = true;
  trendingReachedEnd = false;
  trendingIndex = 0;
  trendingLastIndex = 0;

  constructor(
    private store: Store<AuthState>,
    private eventsService: EventsService,
  ) {}

  ngOnInit() {
    const pageNumber = 1;
    // Featured events infinite
    this.upcomingEventsPage = new Page({ size: 4 });
    this.setFeaturedEventsPage({
      offset: this.upcomingEventsPage.pageNumber,
    });
    // Request second page
    this.upcomingEventsPage = this.upcomingEventsPage.copyWith({
      pageNumber: 2,
    });
    this.setFeaturedEventsPage({
      offset: this.upcomingEventsPage.pageNumber,
    });
    // Trending events infinite
    this.trendingEventsPage = this.trendingEventsPage.copyWith({
      size: 4,
      pageNumber,
    });
    this.setTrendingEventsPage({
      offset: this.trendingEventsPage.pageNumber,
    });
    // Request Trending events second page
    this.trendingEventsPage = this.trendingEventsPage.copyWith({
      pageNumber: 2,
    });
    this.setTrendingEventsPage({
      offset: this.trendingEventsPage.pageNumber,
    });

    // Recent events pagination
    const vw = window.innerWidth; // Viewport with
    let size = 2;
    if (0 <= vw && vw <= 500) {
      this.maxPaginationElements = 3;
    } else if (500 < vw && vw <= 700) {
      this.maxPaginationElements = 5;
    } else if (700 < vw && vw <= 1020) {
      size = 3;
      this.maxPaginationElements = 7;
    } else {
      size = 4;
      this.maxPaginationElements = 8;
    }
    this.recentEventsPage = this.recentEventsPage.copyWith({
      size,
    });
    this.closeByEventsPage = this.closeByEventsPage.copyWith({
      size,
    });
    this.setRecentEventsPage({ offset: this.recentEventsPage.pageNumber });
    this.setCloseByEventsPage({ offset: this.closeByEventsPage.pageNumber });

    this.isAuthenticatedSubscription = this.store
      .select(selectAuthIsAuthenticated)
      .subscribe((isAuthenticated: boolean) => {
        if (isAuthenticated) {
          this.isAuthenticated = true;
        } else {
          this.isAuthenticated = false;
        }
      });
  }

  ngOnDestroy() {}

  // * Featured events
  /**
   * @param  {{offset:number}} pageInfo
   */
  setFeaturedEventsPage(pageInfo: { offset: number }) {
    this.upcomingEventsPage = this.upcomingEventsPage.copyWith({
      pageNumber: pageInfo.offset,
    });
    this.eventsService
      .getFeaturedEventsPageData(this.upcomingEventsPage)
      .subscribe((pagedData: PagedData<Event>) => {
        this.upcomingEventsPage = pagedData.page;
        this.upcomingEvents = [...this.upcomingEvents, ...pagedData.data];
        if (pagedData.page.totalPages === pagedData.page.pageNumber) {
          this.featuredReachedEnd = true;
        } else {
          this.showNextButton = true;
        }
        setTimeout(() => {
          if (this.swiperDirective.first) {
            this.swiperDirective.first.update();
          }
        }, 0);
      });
  }
  onIndexChange(e) {
    const i = e;
    if (i === 0) {
      this.showPrevBubtton = false;
    } else {
      this.showPrevBubtton = true;
    }
    if (e < this.lastIndex) {
      this.showNextButton = true;
    }
    this.swiperDirective.first.setIndex(i);
    if (i >= this.index) {
      this.index = i;
      let value: number;
      const vw = window.innerWidth; // Viewport with
      if (0 <= vw && vw <= 500) {
        value = 1; // 1.5 slides
        if (i === 1) {
          return;
        }
      } else if (500 < vw && vw <= 700) {
        value = 1; // 2 slides
        if (i === 1) {
          return;
        }
      } else if (700 < vw && vw <= 1020) {
        value = 0; // 3 slides
      } else {
        value = 3; // 4 slides
      }
      if (i % 4 === value) {
        if (!this.featuredReachedEnd) {
          this.requestNextPage();
        }
      }
    }
    this.lastIndex = e;
  }
  requestNextPage() {
    this.upcomingEventsPage = this.upcomingEventsPage.copyWith({ size: 4 });
    this.setFeaturedEventsPage({
      offset: this.upcomingEventsPage.pageNumber + 1,
    });
  }
  prevSlide() {
    this.swiperDirective.first.prevSlide();
  }
  nextSlide() {
    this.swiperDirective.first.nextSlide();
  }
  onReachEnd() {
    if (this.featuredReachedEnd) {
      this.showNextButton = false;
    } else {
      this.requestNextPage();
    }
  }

  // * Recent events
  recentEventsPageChanged(pageNumber: number) {
    this.setRecentEventsPage({ offset: pageNumber });
  }
  setRecentEventsPage(pageInfo: { offset: number }) {
    this.recentEventsPage = this.recentEventsPage.copyWith({
      pageNumber: pageInfo.offset,
    });
    this.eventsService
      .getEventsPageData(this.recentEventsPage)
      .subscribe((pagedData: PagedData<Event>) => {
        // console.log(`Page number: ${pagedData.page.pageNumber}; Total pages: ${pagedData.page.totalPages}`);
        this.recentEventsPage = pagedData.page;
        this.recentEvents = pagedData.data.toJS();
      });
  }

  // * CloseBy events
  closeByEventsPageChanged(pageNumber: number) {
    this.setCloseByEventsPage({ offset: pageNumber });
  }
  setCloseByEventsPage(pageInfo: { offset: number }) {
    this.closeByEventsPage = this.closeByEventsPage.copyWith({
      pageNumber: pageInfo.offset,
    });
    this.eventsService
      .getNearbyEventsPageData(this.closeByEventsPage)
      .subscribe((pagedData: PagedData<Event>) => {
        // console.log(`Page number: ${pagedData.page.pageNumber}; Total pages: ${pagedData.page.totalPages}`);
        this.closeByEventsPage = pagedData.page;
        this.closeByEvents = pagedData.data.asImmutable().toJS();
      });
  }

  // * Trending events
  setTrendingEventsPage(pageInfo: { offset: number }) {
    this.trendingEventsPage = this.trendingEventsPage.copyWith({
      pageNumber: pageInfo.offset,
    });
    this.eventsService
      .getTrendingEventsPageData(this.trendingEventsPage)
      .subscribe((pagedData: PagedData<Event>) => {
        // console.log(`Page number: ${pagedData.page.pageNumber}; Total pages: ${pagedData.page.totalPages}`);
        this.trendingEventsPage = pagedData.page;
        this.trendingEvents = [...this.trendingEvents, ...pagedData.data];
        if (pagedData.page.totalPages === pagedData.page.pageNumber) {
          this.trendingReachedEnd = true;
        } else {
          this.showNextButtonTrending = true;
        }
        setTimeout(() => {
          if (this.swiperDirective.last) {
            this.swiperDirective.last.update();
          }
        }, 0);
      });
  }
  onIndexChangeTrending(e) {
    // TODO: arreglar el pedo de que se navega directamente a una slide
    const i = e;
    if (i === 0) {
      this.showPrevBubttonTrending = false;
    } else {
      this.showPrevBubttonTrending = true;
    }
    if (e < this.trendingLastIndex) {
      this.showNextButtonTrending = true;
    }
    this.swiperDirective.last.setIndex(i);
    if (i >= this.trendingIndex) {
      this.trendingIndex = i;
      let value: number;
      const vw = window.innerWidth; // Viewport with
      if (0 <= vw && vw <= 500) {
        value = 1; // 1.5 slides
        if (i === 1) {
          return;
        }
      } else if (500 < vw && vw <= 700) {
        value = 1; // 2 slides
        if (i === 1) {
          return;
        }
      } else if (700 < vw && vw <= 1020) {
        value = 0; // 3 slides
      } else {
        value = 3; // 4 slides
      }
      if (i % 4 === value) {
        if (!this.featuredReachedEnd) {
          this.requestNextPageTrending();
        }
      }
    }
    this.trendingLastIndex = e;
  }
  requestNextPageTrending() {
    this.trendingEventsPage = this.trendingEventsPage.copyWith({ size: 4 });
    this.setTrendingEventsPage({
      offset: this.trendingEventsPage.pageNumber + 1,
    });
  }
  prevSlideTrending() {
    this.swiperDirective.last.prevSlide();
  }
  nextSlideTrending() {
    this.swiperDirective.last.nextSlide();
  }
  onReachEndTrending() {
    if (this.trendingReachedEnd) {
      this.showNextButtonTrending = false;
    } else {
      this.requestNextPageTrending();
    }
  }
}
