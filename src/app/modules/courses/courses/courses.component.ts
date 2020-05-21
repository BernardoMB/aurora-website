import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, HostListener, ViewChildren, QueryList } from '@angular/core';
import { CoursesService } from '../services/courses.service';
import { Subscription, Observable } from 'rxjs';
import { Course } from '../../../shared/models/course.model';
import { Category } from '../../../shared/models/category.model';
import { Page, PagedData } from '../../../shared/utils';
import { Store } from '@ngrx/store';
import { AuthState } from '../../../store/auth/auth.state';
import { selectAuthIsAuthenticated } from '../../../store/auth/auth.selectors';
import { Router, NavigationEnd } from '@angular/router';
import {
  SwiperComponent,
  SwiperDirective,
  SwiperConfigInterface,
  SwiperScrollbarInterface,
  SwiperPaginationInterface
} from 'ngx-swiper-wrapper';

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
  config: any = {
    initialSlide: 0, // Slide Index Starting from 0
    paginationClickable: true, // Making pagination dots clicable
    pagination: '.swiper-pagination', // Pagination Class defined
    nextButton: '.swiper-button-next', // Class for next button
    prevButton: '.swiper-button-prev', // Class for prev button
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
    }
  };

  // Featured courses pagination
  //@ViewChild(SwiperDirective) featuredCoursesSwiper?: SwiperDirective;
  featuredCourses: Course[] = [];
  featuredCoursesPage = new Page();
  showPrevBubtton = false;
  showNextButton = true;
  featuredReachedEnd = false;

  // Recent courses pagination (Se quedan como estan)
  recentCourses: Course[];
  recentCoursesPage = new Page();

  // Trending courses pagination
  //@ViewChild(SwiperDirective) trendingCoursesSwiper?: SwiperDirective;
  trendingCourses: Course[] = [];
  trendingCoursesPage = new Page();
  showPrevBubttonTrending = false;
  showNextButtonTrending = true;
  trendingLastPageFetched: number;
  trendingTotalpages: number;

  // Categories
  categoriesSubscription: Subscription;
  topCategories: Category[];
  featuredCategories: Category[];

  constructor(
    private coursesService: CoursesService,
    private store: Store<AuthState>,
    private router: Router
  ) {
    this.router.events.subscribe(event => {
      // console.log('Navigation event:', event);
      if (event instanceof NavigationEnd) {
        // Prevent scrolling if changed tab.
        const fragment = event.url.split('#')[1];
        if (fragment) {
          return;
        }
        window.scrollTo(0, 0);
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
    this.featuredCoursesPage.size = 4;
    this.featuredCoursesPage.pageNumber = 1;
    this.setFeaturedCoursesPage({ offset: this.featuredCoursesPage.pageNumber });
    // Request second page
    this.featuredCoursesPage.pageNumber = 2;
    this.setFeaturedCoursesPage({ offset: this.featuredCoursesPage.pageNumber });

    // Recent courses pagination
    const vw = window.innerWidth; // Viewport with
    if (0 <= vw && vw <= 500) {
      this.recentCoursesPage.size = 2;
    } else if (500 < vw && vw <= 700) {
      this.recentCoursesPage.size = 2;
    } else if (700 < vw && vw <= 1020) {
      this.recentCoursesPage.size = 3;
    } else {
      this.recentCoursesPage.size = 4;
    }
    this.recentCoursesPage.pageNumber = 1;
    this.setRecentCoursesPage({ offset: this.recentCoursesPage.pageNumber });

    // Featured courses infinite
    this.trendingCoursesPage.size = 4;
    this.trendingCoursesPage.pageNumber = 1;
    this.setTrendingCoursesPage({ offset: this.trendingCoursesPage.pageNumber });
    // Request second page
    this.trendingCoursesPage.pageNumber = 2;
    this.setTrendingCoursesPage({ offset: this.trendingCoursesPage.pageNumber });

    this.categoriesSubscription = this.coursesService.getCategories().subscribe((categories: Category[]) => {
      // TODO: Add featured courses into the model and incorporate functionality properly into thee front-end.
      if (categories) {
        this.topCategories = categories.slice(0, 5);
        this.featuredCategories = categories.slice(4, 12);
      }
    });

    this.isAuthenticatedSubscription = this.store.select(selectAuthIsAuthenticated).subscribe((isAuthenticated: boolean) => {
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
  /**
   * Paging function
   * @param pageInfo The page to select
   */
  setFeaturedCoursesPage(pageInfo: { offset: number }) {
    this.featuredCoursesPage.pageNumber = pageInfo.offset;
    this.coursesService.getFeaturedCoursesPageData(this.featuredCoursesPage).subscribe((pagedData: PagedData<Course>) => {
      // console.log(`Page number: ${pagedData.page.pageNumber}; Total pages: ${pagedData.page.totalPages}`);
      this.featuredCoursesPage = pagedData.page;
      // this.trendingCourses = pagedData.data;
      this.featuredCourses = [
        ...(this.featuredCourses),
        ...(pagedData.data)
      ];
      if (pagedData.page.totalPages === pagedData.page.pageNumber) {
        //this.showNextButton = false;
        console.log('setting reach end to true');
        this.featuredReachedEnd = true;
      } else {
        this.showNextButton = true; console.log('Setted next button to true');
      }
      //console.log('Show next button', this.showNextButton);
      setTimeout(() => {
        ////this.featuredCoursesSwiper.update();
        /* console.log('PENENENEEEe', this.swiperDirective); */
        this.swiperDirective.first.update();
      }, 0);
    });
  }
  // Swiper slider
  index = 0;
  lastIndex = 0;
  onIndexChange(e) {
    // TODO: arreglar el pedo de que se navega directamente a una slide
    const i = e;
    if (i === 0) {
      this.showPrevBubtton = false;
    } else {
      this.showPrevBubtton = true;
    }
    if (e < this.lastIndex) {
      this.showNextButton = true; console.log('Setted next button to true esp');
    }
    //console.log('Show prev button', this.showPrevBubtton);
    ////this.featuredCoursesSwiper.setIndex(i);
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
      if ((i % 4) === value) {
        if (!this.featuredReachedEnd) {
          this.requestNextPage();
        }
      }
    }
    this.lastIndex = e;
  }
  requestNextPage() {
    this.featuredCoursesPage.size = 4;
    this.setFeaturedCoursesPage({offset: this.featuredCoursesPage.pageNumber + 1});
  }
  prevSlide() {
    ////this.featuredCoursesSwiper.prevSlide();
    this.swiperDirective.first.prevSlide();
  }
  nextSlide() {
    ////this.featuredCoursesSwiper.nextSlide();
    this.swiperDirective.first.nextSlide();
  }
  onReachEnd() {
    console.log('Reached end', this.featuredReachedEnd);
    if (this.featuredReachedEnd) {
      this.showNextButton = false;
    }
  }

  pene(){
    console.log(this.showNextButton);
  }


























  // * Recent courses
  /**
   * This function gets called when the user clicks a button of the ngx paginator component.
   * @param {number} pageNumber
   * @memberof CoursesComponent
   */
  recentCoursesPageChanged(pageNumber: number) {
    this.recentCoursesPage.pageNumber = pageNumber;
    this.setRecentCoursesPage({ offset: pageNumber });
  }
  /**
   * Paging function
   * @param pageInfo The page to select
   */
  setRecentCoursesPage(pageInfo: { offset: number }) {
    this.recentCoursesPage.pageNumber = pageInfo.offset;
    this.coursesService.getCoursesPageData(this.recentCoursesPage).subscribe((pagedData: PagedData<Course>) => {
      // console.log(`Page number: ${pagedData.page.pageNumber}; Total pages: ${pagedData.page.totalPages}`);
      this.recentCoursesPage = pagedData.page;
      this.recentCourses = pagedData.data;
    });
  }




















  // * Trending courses
  /**
   * Paging function
   * @param pageInfo The page to select
   */
  setTrendingCoursesPage(pageInfo: { offset: number }) {
    this.trendingCoursesPage.pageNumber = pageInfo.offset;
    this.coursesService.getTrendingCoursesPageData(this.trendingCoursesPage).subscribe((pagedData: PagedData<Course>) => {
      // console.log(`Page number: ${pagedData.page.pageNumber}; Total pages: ${pagedData.page.totalPages}`);
      this.trendingCoursesPage = pagedData.page;
      // this.trendingCourses = pagedData.data;
      this.trendingCourses = [
        ...(this.trendingCourses),
        ...(pagedData.data)
      ];
      this.trendingLastPageFetched = pagedData.page.pageNumber;
      this.trendingTotalpages = pagedData.page.totalPages;
      if (pagedData.page.totalPages === pagedData.page.pageNumber) {
        this.showNextButtonTrending = false;
      } else {
        this.showNextButtonTrending = true;
      }
      //console.log('Show next button', this.showNextButtonTrending);
      setTimeout(() => {
        ////this.trendingCoursesSwiper.update();
        this.swiperDirective.last.update();
      }, 0);
    });
  }
  // Swiper slider
  trendingIndex = 0;
  onIndexChangeTrending(e) {
    // TODO: arreglar el pedo de que se navega directamente a una slide
    const i = e;
    if (i === 0) {
      this.showPrevBubttonTrending = false;
    } else {
      this.showPrevBubttonTrending = true;
    }
    if (this.showNextButtonTrending === false) {
      this.showNextButtonTrending = true;
    }
    //console.log('Show prev button', this.showPrevBubtton);
    ////this.trendingCoursesSwiper.setIndex(i);
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
      if ((i % 4) === value) {
        this.requestNextPageTrending();
      }
    }
  }
  requestNextPageTrending() {
    this.trendingCoursesPage.size = 4;
    this.setTrendingCoursesPage({offset: this.trendingCoursesPage.pageNumber + 1});
  }
  prevSlideTrending() {
    ////this.trendingCoursesSwiper.prevSlide();
    this.swiperDirective.last.prevSlide();
  }
  nextSlideTrending() {
    ////this.trendingCoursesSwiper.nextSlide();
    this.swiperDirective.last.nextSlide();
  }
  onReachEndTrending() {
    if (this.trendingLastPageFetched === this.trendingTotalpages) {
      this.showNextButtonTrending = false;
    }
  }

}
