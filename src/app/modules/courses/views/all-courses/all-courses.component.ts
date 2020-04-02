import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Course } from '../../../../shared/models/course.model';
import { CoursesService } from '../../services/courses.service';
import { Category } from '../../../../shared/models/category.model';
import { ActivatedRoute, Router, NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Page } from '../../../../shared/utils';
import { PagedData } from '../../../../shared/models/paged-data.model';

@Component({
  selector: 'app-all-courses',
  templateUrl: './all-courses.component.html',
  styleUrls: ['./all-courses.component.scss'],
})
export class AllCoursesComponent implements OnInit, OnDestroy {
  routerSubscription: Subscription;
  categoriesSubscription: Subscription;
  topCategories: Category[];
  featuredCategories: Category[];
  courses: Course[];

  // Courses pagination
  page = new Page();

  constructor(
    private coursesService: CoursesService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.routerSubscription = this.router.events.pipe(
      filter((event: Event) => {
        return event instanceof NavigationEnd;
      })
    ).subscribe((event: NavigationEnd) => {
      if (this.route.snapshot.queryParams.page) {
        const page = this.route.snapshot.queryParams.page;
        this.page.size = 15;
        this.page.pageNumber = page;
        this.setPage({ offset: page });
      } else {
        this.router.navigate(['./'], { relativeTo: this.route, queryParams: { page: 1 } });
      }
    });
  }

  ngOnInit() {
    this.categoriesSubscription = this.coursesService.getCategories().subscribe((categories: Category[]) => {
      // TODO: Add featured courses into the model and incorporate functionality properly into thee front-end.
      if (categories) {
        this.topCategories = categories.slice(0, 5);
        this.featuredCategories = categories.slice(4, 12);
      }
    });
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }

  pageChanged(pageNumber: number) {
    this.page.pageNumber = pageNumber;
    this.router.navigate(['./'], { relativeTo: this.route, queryParams: { page: pageNumber } });
  }

  /**
   * Paging function
   * @param pageInfo The page to select
   */
  setPage(pageInfo: { offset: number }) {
    this.page.pageNumber = pageInfo.offset;
    this.coursesService.getCoursesPageData(this.page).subscribe((pagedData: PagedData<Course>) => {
      console.log(`Page number: ${pagedData.page.pageNumber}; Total pages: ${pagedData.page.totalPages}`);
      this.page = pagedData.page;
      this.courses = pagedData.data;
    });
  }
}
