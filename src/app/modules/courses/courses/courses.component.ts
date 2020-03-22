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


  categoriesSubscription: Subscription;
  topCategories: Category[];
  featuredCategories: Category[];
  recentCoursesubscription: Subscription;
  recentCourses: Course[];
  trendingCoursesSubscription: Subscription;
  trendingCourses: Course[];

  constructor(private coursesService: CoursesService) {}

  ngOnInit() {
    // Featured courses pagination
    this.featuredCoursesPage.size = 5;
    this.featuredCoursesPage.pageNumber = 1;
    this.setFeaturedCoursesPage({ offset: this.featuredCoursesPage.pageNumber });

    this.categoriesSubscription = this.coursesService.getCategories().subscribe((categories: Category[]) => {
      // TODO: Add featured courses into the model and incorporate functionality properly into thee front-end.
      if (categories) {
        this.topCategories = categories.slice(0, 5);
        this.featuredCategories = categories.slice(4, 12);
      }
    });
    this.recentCoursesubscription = this.coursesService.getRecentCourses(0, 6).subscribe((recentCourses: Course[]) => {
      if (recentCourses) {
        this.recentCourses = recentCourses;
      }
    });
    this.trendingCoursesSubscription = this.coursesService.getFeaturedCourses(0, 5).subscribe((featuredCourses: Course[]) => {
      if (featuredCourses) {
        this.trendingCourses = featuredCourses; // <-- Create endpoint based on numero of subscribers
      }
    });
  }

  ngOnDestroy() {
    this.categoriesSubscription.unsubscribe();
    this.recentCoursesubscription.unsubscribe();
    this.trendingCoursesSubscription.unsubscribe();
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
}
