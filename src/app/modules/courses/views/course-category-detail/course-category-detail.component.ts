import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, UrlSegment } from '@angular/router';
import { CoursesService } from '../../services/courses.service';
import { Category } from 'src/app/shared/models/category.model';
import { Subscription } from 'rxjs';
import { Course } from '../../../../shared/models/course.model';
import { Page, PagedData } from '../../../../shared/utils';

@Component({
  selector: 'app-course-category-detail',
  templateUrl: './course-category-detail.component.html',
  styleUrls: ['./course-category-detail.component.scss'],
})
export class CourseCategoryDetailComponent implements OnInit, OnDestroy {
  category: Category;

  // Featured courses pagination
  featuredCourses: Course[];
  featuredCoursesPage = new Page();

  // Recent courses pagination
  recentCourses: Course[];
  recentCoursesPage = new Page();

  constructor(
    private router: Router,
    private readonly route: ActivatedRoute,
    private coursesService: CoursesService
  ) {
  }

  ngOnInit() {
    this.route.data.subscribe((data) => {
      console.log('%c Activated route snapshot resolved data ', 'background: #222; color: #bada55');
      console.log(data);
      if (data.categoryDetailInfo) {
        const categoryDetailInfo: { category: Category } = data.categoryDetailInfo;
        this.category = categoryDetailInfo.category;
        // Featured courses pagination
        this.featuredCoursesPage.size = 5;
        this.featuredCoursesPage.pageNumber = 1;
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

  featuredCoursesPageChanged(pageNumber: number) {
    this.featuredCoursesPage.pageNumber = pageNumber;
    this.setFeaturedCoursesPage({ offset: pageNumber }, this.category.id);
  }

  /**
   * Paging function
   * @param pageInfo The page to select
   */
  setFeaturedCoursesPage(pageInfo: { offset: number }, categoryId: string) {
    this.featuredCoursesPage.pageNumber = pageInfo.offset;
    this.coursesService.getCategoryFeaturedCoursesPageData(this.featuredCoursesPage, categoryId)
      .subscribe((pagedData: PagedData<Course>) => {
        console.log(`Page number: ${pagedData.page.pageNumber}; Total pages: ${pagedData.page.totalPages}`);
        this.featuredCoursesPage = pagedData.page;
        this.featuredCourses = pagedData.data;
      });
  }

  recentCoursesPageChanged(pageNumber: number) {
    this.recentCoursesPage.pageNumber = pageNumber;
    this.setRecentCoursesPage({ offset: pageNumber }, this.category.id);
  }

  /**
   * Paging function
   * @param pageInfo The page to select
   */
  setRecentCoursesPage(pageInfo: { offset: number }, categoryId: string) {
    this.recentCoursesPage.pageNumber = pageInfo.offset;
    this.coursesService.getCategoryCoursesPageData(this.recentCoursesPage, categoryId).subscribe((pagedData: PagedData<Course>) => {
      console.log(`Page number: ${pagedData.page.pageNumber}; Total pages: ${pagedData.page.totalPages}`);
      this.recentCoursesPage = pagedData.page;
      this.recentCourses = pagedData.data;
    });
  }

}
