import { Component, OnInit, OnDestroy } from '@angular/core';
import { CoursesService } from '../services/courses.service';
import { Subscription } from 'rxjs';
import { Course } from '../../../shared/models/course.model';
import { Category } from '../../../shared/models/category.model';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
})
export class CoursesComponent implements OnInit, OnDestroy {
  featuredCoursesSubscription: Subscription;
  featuredCourses: Course[];
  categoriesSubscription: Subscription;
  topCategories: Category[];
  featuredCategories: Category[];
  recentCoursesubscription: Subscription;
  recentCourses: Course[];
  trendingCoursesSubscription: Subscription;
  trendingCourses: Course[];

  constructor(private coursesService: CoursesService) {}

  ngOnInit() {
    this.featuredCoursesSubscription = this.coursesService.getFeaturedCourses(0, 5).subscribe((featuredCourses: Course[]) => {
      if (featuredCourses) {
        this.featuredCourses = featuredCourses;
      }
    });
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
    this.featuredCoursesSubscription.unsubscribe();
    this.categoriesSubscription.unsubscribe();
    this.recentCoursesubscription.unsubscribe();
    this.trendingCoursesSubscription.unsubscribe();
  }
}
