import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { CoursesService } from '../services/courses.service';
import { Subscription } from 'rxjs';
import { Course } from '../../../shared/models/course.model';
import { Category } from '../../../shared/models/category.model';
import { Store } from '@ngrx/store';
import { AuthState } from '../../../store/auth/auth.state';
import { selectAuthIsAuthenticated } from '../../../store/auth/auth.selectors';
import { Router, NavigationEnd } from '@angular/router';
import {
  SwiperDirective,
  SwiperConfigInterface
} from 'ngx-swiper-wrapper';
import { PagedData } from '../../../shared/models/paged-data.model';
import { Page } from '../../../shared/models/page.model';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
})
export class CoursesComponent implements OnInit, OnDestroy {
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

  // Featured courses pagination
  featuredCourses: Course[] = [];
  featuredCoursesPage = new Page({ pageNumber: 1, size: 4 });
  showPrevBubtton = false;
  showNextButton = true;
  featuredReachedEnd = false;
  index = 0;
  lastIndex = 0;

  // Categories
  categoriesSubscription: Subscription;
  topCategories: Category[];
  featuredCategories: Category[];

  // Recent courses pagination
  recentCourses: Course[];
  recentCoursesPage = new Page();

  // Trending courses pagination
  trendingCourses: Course[] = [];
  trendingCoursesPage = new Page({ pageNumber: 1, size: 4 });
  showPrevBubttonTrending = false;
  showNextButtonTrending = true;
  trendingReachedEnd = false;
  trendingIndex = 0;
  trendingLastIndex = 0;

  constructor(
    private coursesService: CoursesService,
    private store: Store<AuthState>,
    private router: Router,
  ) {
    this.router.events.subscribe((event) => {
      // console.log('Navigation event:', event);
      if (event instanceof NavigationEnd) {
        // Prevent scrolling if changed tab.
        const fragment = event.url.split('#')[1];
        if (fragment) {
          return;
        }
        //window.scrollTo(0, 0);
      }
      return;
    });
  }

  // Recent courses pagination
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    // console.log(event.target.innerWidth);
    // console.log('Eventonsion', event);
    // TODO: Reset Recently added pagination with appropiate number of pages
  }

  ngOnInit() {
    // Featured courses infinite
    this.setFeaturedCoursesPage({
      offset: 1,
    });
    // Request second page
    this.setFeaturedCoursesPage({
      offset: 2,
    });

    // Recent courses pagination
    const vw = window.innerWidth; // Viewport with
    let size = 2;
    if (500 < vw && vw <= 700) {
      size = 2;
    } else if (700 < vw && vw <= 1020) {
      size = 3;
    } else {
      size = 4;
    }
    this.recentCoursesPage = this.recentCoursesPage.copyWith({ size });
    this.setRecentCoursesPage({ offset: 1 });

    // Featured courses infinite
    this.setTrendingCoursesPage({
      offset: 1,
    });
    // Request second page
    this.setTrendingCoursesPage({
      offset: 2,
    });

    this.categoriesSubscription = this.coursesService
      .getCategories()
      .subscribe((categories: Category[]) => {
        // TODO: Add featured courses into the model and incorporate functionality properly into thee front-end.
        if (categories) {
          /* this.topCategories = categories.slice(0, 5);
          this.featuredCategories = categories.slice(4, 12); */
          this.featuredCategories = categories;
        }
      });

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

  ngOnDestroy() {
    this.categoriesSubscription.unsubscribe();
  }

  // * Featured courses
  setFeaturedCoursesPage(pageInfo: { offset: number }) {
    this.featuredCoursesPage = this.featuredCoursesPage.copyWith({
      pageNumber: pageInfo.offset,
    });
    this.coursesService
      .getFeaturedCoursesPageData(this.featuredCoursesPage)
      .subscribe((pagedData: PagedData<Course>) => {
        // console.log(`Page number: ${pagedData.page.pageNumber}; Total pages: ${pagedData.page.totalPages}`);
        this.featuredCoursesPage = pagedData.page;
        this.featuredCourses = [
          ...this.featuredCourses,
          ...pagedData.data.asImmutable(),
        ];
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
    this.featuredCoursesPage = this.featuredCoursesPage.copyWith({ size: 4 });
    this.setFeaturedCoursesPage({
      offset: this.featuredCoursesPage.pageNumber + 1,
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

  // * Recent courses
  recentCoursesPageChanged(pageNumber: number) {
    this.setRecentCoursesPage({ offset: pageNumber });
  }
  setRecentCoursesPage(pageInfo: { offset: number }) {
    this.recentCoursesPage = this.recentCoursesPage.copyWith({
      pageNumber: pageInfo.offset,
    });
    this.coursesService
      .getCoursesPageData(this.recentCoursesPage)
      .subscribe((pagedData: PagedData<Course>) => {
        // console.log(`Page number: ${pagedData.page.pageNumber}; Total pages: ${pagedData.page.totalPages}`);
        this.recentCoursesPage = pagedData.page;
        this.recentCourses = pagedData.data.asImmutable().toJS();
      });
  }

  // * Trending courses
  setTrendingCoursesPage(pageInfo: { offset: number }) {
    this.trendingCoursesPage = this.trendingCoursesPage.copyWith({
      pageNumber: pageInfo.offset,
    });
    this.coursesService
      .getTrendingCoursesPageData(this.trendingCoursesPage)
      .subscribe((pagedData: PagedData<Course>) => {
        // console.log(`Page number: ${pagedData.page.pageNumber}; Total pages: ${pagedData.page.totalPages}`);
        this.trendingCoursesPage = pagedData.page;
        this.trendingCourses = [
          ...this.trendingCourses,
          ...pagedData.data.asImmutable(),
        ];
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
    this.trendingCoursesPage = this.trendingCoursesPage.copyWith({ size: 4 });
    this.setTrendingCoursesPage({
      offset: this.trendingCoursesPage.pageNumber + 1,
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
