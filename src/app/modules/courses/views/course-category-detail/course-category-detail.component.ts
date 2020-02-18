import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, UrlSegment } from '@angular/router';
import { CoursesService } from '../../services/courses.service';
import { Category } from 'src/app/shared/models/category.model';
import { Subscription } from 'rxjs';
import { Course } from '../../../../shared/models/course.model';

@Component({
  selector: 'app-course-category-detail',
  templateUrl: './course-category-detail.component.html',
  styleUrls: ['./course-category-detail.component.scss'],
})
export class CourseCategoryDetailComponent implements OnInit, OnDestroy {

  categorySubscription: Subscription;
  category: Category;
  featuredCoursesSubscription: Subscription;
  featuredCourses: Course[];
  categoryCoursesSubscription: Subscription;
  categoryCourses: Course[];

  constructor(
    private router: Router,
    private readonly route: ActivatedRoute,
    private coursesService: CoursesService
  ) {
    this.route.url.subscribe((url: UrlSegment[]) => {
      const id = url[1].path;
      this.getCategory(id);
      this.getFeaturedCourses(id);
      this.getCategoryCourses(id);
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.categorySubscription.unsubscribe();
    this.featuredCoursesSubscription.unsubscribe();
    this.categoryCoursesSubscription.unsubscribe();
  }

  getCategory(categoryId: string) {
    this.categorySubscription =  this.coursesService.getCategory(categoryId).subscribe((category: Category) => {
      if (category) {
        console.log('Category', category);
        this.category = category;
      }
    });
  }

  getFeaturedCourses(categoryId: string) {
    this.featuredCoursesSubscription =  this.coursesService.getCategoryFeaturedCourses(categoryId).subscribe((courses: Array<Course>) => {
      if (courses) {
        console.log('Featured courses', courses);
        this.featuredCourses = courses;
      }
    });
  }

  getCategoryCourses(categoryId: string) {
    this.categoryCoursesSubscription =  this.coursesService.getCategoryCourses(categoryId).subscribe((courses: Array<Course>) => {
      if (courses) {
        console.log('Category courses', courses);
        this.categoryCourses = courses;
      }
    });
  }
}
