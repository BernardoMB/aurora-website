import { Component, OnInit, OnDestroy, ViewChildren, QueryList } from '@angular/core';
import { Router, ActivatedRoute, UrlSegment } from '@angular/router';
import { CoursesService } from '../../services/courses.service';
import { Category } from 'src/app/shared/models/category.model';
import { Subscription } from 'rxjs';
import { Course } from '../../../../shared/models/course.model';
import { Page, PagedData } from '../../../../shared/utils';
import { SwiperDirective, SwiperConfigInterface } from 'ngx-swiper-wrapper';

@Component({
  selector: 'app-course-category-detail',
  templateUrl: './course-category-detail.component.html',
  styleUrls: ['./course-category-detail.component.scss'],
})
export class CourseCategoryDetailComponent implements OnInit, OnDestroy {
  category: Category;

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
    }
  };

  // Featured courses pagination
  featuredCourses: Course[] = [];
  featuredCoursesPage = new Page();
  showPrevBubtton = false;
  showNextButton = true;
  featuredReachedEnd = false;
  index = 0;
  lastIndex = 0;

  // Recent courses pagination
  recentCourses: Course[];
  recentCoursesPage = new Page();

  constructor(
    private coursesService: CoursesService,
    private readonly route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.route.data.subscribe((data) => {
      // console.log('%c Activated route snapshot resolved data ', 'background: #222; color: #bada55');
      // console.log(data);
      if (data.categoryDetailInfo) {
        const categoryDetailInfo: { category: Category } = data.categoryDetailInfo;
        this.category = categoryDetailInfo.category;

        // Featured courses pagination infinite slider
        this.featuredCoursesPage.size = 4;
        this.featuredCoursesPage.pageNumber = 1;
        this.setFeaturedCoursesPage({ offset: this.featuredCoursesPage.pageNumber }, categoryDetailInfo.category.id);
        // Request second page
        this.featuredCoursesPage.pageNumber = 2;
        this.setFeaturedCoursesPage({ offset: this.featuredCoursesPage.pageNumber }, categoryDetailInfo.category.id);

        // Recent courses pagination
        this.recentCoursesPage.size = 15;
        this.recentCoursesPage.pageNumber = 1;
        this.setRecentCoursesPage({ offset: this.recentCoursesPage.pageNumber }, categoryDetailInfo.category.id);
      }
    });

  }

  ngOnDestroy() {
  }

  // * Featured courses
  setFeaturedCoursesPage(pageInfo: { offset: number }, categoryId: string) {
    this.featuredCoursesPage.pageNumber = pageInfo.offset;
    this.coursesService.getCategoryFeaturedCoursesPageData(this.featuredCoursesPage, categoryId).subscribe((pagedData: PagedData<Course>) => {
      // console.log(`Page number: ${pagedData.page.pageNumber}; Total pages: ${pagedData.page.totalPages}`);
      this.featuredCoursesPage = pagedData.page;
      this.featuredCourses = [
        ...(this.featuredCourses),
        ...(pagedData.data)
      ];
      if (pagedData.page.totalPages === pagedData.page.pageNumber) {
        this.featuredReachedEnd = true;
      } else {
        this.showNextButton = true;
      }
      setTimeout(() => {
        this.swiperDirective.first.update();
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
    this.setFeaturedCoursesPage({offset: this.featuredCoursesPage.pageNumber + 1}, this.category.id);
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
    this.recentCoursesPage.pageNumber = pageNumber;
    this.setRecentCoursesPage({ offset: pageNumber }, this.category.id);
  }
  setRecentCoursesPage(pageInfo: { offset: number }, categoryId: string) {
    this.recentCoursesPage.pageNumber = pageInfo.offset;
    this.coursesService.getCategoryCoursesPageData(this.recentCoursesPage, categoryId).subscribe((pagedData: PagedData<Course>) => {
      // console.log(`Page number: ${pagedData.page.pageNumber}; Total pages: ${pagedData.page.totalPages}`);
      this.recentCoursesPage = pagedData.page;
      this.recentCourses = pagedData.data;
    });
  }

}
