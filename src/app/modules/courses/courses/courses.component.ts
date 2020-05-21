import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { CoursesService } from '../services/courses.service';
import { Subscription } from 'rxjs';
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
    },
  };

  // Featured courses pagination
  @ViewChild('featuredCoursesSwiper') featuredCoursesSwiper?: SwiperDirective;
  featuredCourses: Course[] = [];
  featuredCoursesPage = new Page();

  // Recent courses pagination (Se quedan como estan)
  recentCourses: Course[];
  recentCoursesPage = new Page();

  // Trending courses pagination
  trendingCourses: Course[];
  trendingCoursesPage = new Page();

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

  ngOnInit() {
    // Test courses infinite
    this.featuredCoursesPage.size = 4;
    this.featuredCoursesPage.pageNumber = 1;
    this.setFeaturedCoursesPage({ offset: this.featuredCoursesPage.pageNumber });
    // Request second page
    this.featuredCoursesPage.pageNumber = 2;
    this.setFeaturedCoursesPage({ offset: this.featuredCoursesPage.pageNumber });

    // Recent courses pagination
    this.recentCoursesPage.size = 2;
    this.recentCoursesPage.pageNumber = 1;
    this.setRecentCoursesPage({ offset: this.recentCoursesPage.pageNumber });

    // Trending courses pagination
    this.trendingCoursesPage.size = 5;
    this.trendingCoursesPage.pageNumber = 1;
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
      setTimeout(() => {
        this.featuredCoursesSwiper.update();
      }, 0);
    });
  }
  // Swiper slider
  index = 0;
  onIndexChange(e) {
    // TODO: arreglar el pedo de que se navega directamente a una slide
    const i = e;
    this.featuredCoursesSwiper.setIndex(i);
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
        this.requestNextPage();
      }
    }
  }
  requestNextPage() {
    this.featuredCoursesPage.size = 4;
    this.setFeaturedCoursesPage({offset: this.featuredCoursesPage.pageNumber + 1});
  }
  prevSlide() {
    this.featuredCoursesSwiper.prevSlide();
  }
  nextSlide() {
    this.featuredCoursesSwiper.nextSlide();
  }




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

  /**
   * This function gets called when the user clicks a button of the ngx paginator component.
   * @param {number} pageNumber
   * @memberof CoursesComponent
   */
  trendingCoursesPageChanged(pageNumber: number) {
    this.trendingCoursesPage.pageNumber = pageNumber;
    this.setTrendingCoursesPage({ offset: pageNumber });
  }

  /**
   * Paging function
   * @param pageInfo The page to select
   */
  setTrendingCoursesPage(pageInfo: { offset: number }) {
    this.trendingCoursesPage.pageNumber = pageInfo.offset;
    this.coursesService.getTrendingCoursesPageData(this.trendingCoursesPage).subscribe((pagedData: PagedData<Course>) => {
      // console.log(`Page number: ${pagedData.page.pageNumber}; Total pages: ${pagedData.page.totalPages}`);
      this.trendingCoursesPage = pagedData.page;
      this.trendingCourses = pagedData.data;
    });
  }

  /**
   * This function gets called when the user clicks a button of the ngx paginator component.
   * @param {number} pageNumber
   * @memberof CoursesComponent
   */
  testCoursesPageChanged(pageNumber: number) {
    this.trendingCoursesPage.pageNumber = pageNumber;
    this.setTrendingCoursesPage({ offset: pageNumber });
  }

}
