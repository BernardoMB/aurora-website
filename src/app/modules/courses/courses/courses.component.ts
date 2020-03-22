import { Component, OnInit, OnDestroy } from '@angular/core';
import { CoursesService } from '../services/courses.service';
import { Subscription } from 'rxjs';
import { Course } from '../../../shared/models/course.model';
import { Category } from '../../../shared/models/category.model';
import { Page, PagedData } from '../../../shared/utils';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
})
export class CoursesComponent implements OnInit, OnDestroy {

  // Featured courses pagination
  featuredCourses: Course[];
  featuredCoursesPage = new Page();

  // Recent courses pagination
  recentCourses: Course[];
  recentCoursesPage = new Page();

  // Trending courses pagination
  trendingCourses: Course[];
  trendingCoursesPage = new Page();

  // Categories
  categoriesSubscription: Subscription;
  topCategories: Category[];
  featuredCategories: Category[];

  constructor(private coursesService: CoursesService) {}

  ngOnInit() {
    // Featured courses pagination
    this.featuredCoursesPage.size = 5;
    this.featuredCoursesPage.pageNumber = 1;
    this.setFeaturedCoursesPage({ offset: this.featuredCoursesPage.pageNumber });

    // Recent courses pagination
    this.recentCoursesPage.size = 5;
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
  }

  ngOnDestroy() {
    this.categoriesSubscription.unsubscribe();
  }

  featuredCoursesPageChanged(pageNumber: number) {
    this.featuredCoursesPage.pageNumber = pageNumber;
    this.setFeaturedCoursesPage({ offset: pageNumber });
  }

  /**
   * Paging function
   * @param pageInfo The page to select
   */
  setFeaturedCoursesPage(pageInfo: { offset: number }) {
    this.featuredCoursesPage.pageNumber = pageInfo.offset;
    this.coursesService.getFeaturedCoursesPageData(this.featuredCoursesPage).subscribe((pagedData: PagedData<Course>) => {
      console.log(`Page number: ${pagedData.page.pageNumber}; Total pages: ${pagedData.page.totalPages}`);
      this.featuredCoursesPage = pagedData.page;
      this.featuredCourses = pagedData.data;
    });
  }

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
    this.coursesService.getPageData(this.recentCoursesPage).subscribe((pagedData: PagedData<Course>) => {
      console.log(`Page number: ${pagedData.page.pageNumber}; Total pages: ${pagedData.page.totalPages}`);
      this.recentCoursesPage = pagedData.page;
      this.recentCourses = pagedData.data;
    });
  }

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
      console.log(`Page number: ${pagedData.page.pageNumber}; Total pages: ${pagedData.page.totalPages}`);
      this.trendingCoursesPage = pagedData.page;
      this.trendingCourses = pagedData.data;
    });
  }
}
