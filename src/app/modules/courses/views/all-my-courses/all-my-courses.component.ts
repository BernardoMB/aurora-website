import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../../../shared/models/user.model';
import { Subscription } from 'rxjs';
import { AuthState } from '../../../../store/auth/auth.state';
import { Store, select } from '@ngrx/store';
import { Router } from '@angular/router';
import { selectAuthIsAuthenticated, selectAuthUser } from '../../../../store/auth/auth.selectors';
import { Course } from '../../../../shared/models/course.model';
import { CoursesService } from '../../services/courses.service';

@Component({
  selector: 'app-all-my-courses',
  templateUrl: './all-my-courses.component.html',
  styleUrls: ['./all-my-courses.component.scss']
})
export class AllMyCoursesComponent implements OnInit, OnDestroy {
  userSubscription: Subscription;
  user: User;
  isAuthenticatedSubscription: Subscription;
  isAuthenticated: boolean;
  coursesSubscription: Subscription;
  courses: Course[];

  constructor(
    private store: Store<AuthState>,
    private router: Router,
    private coursesService: CoursesService
  ) { }

  ngOnInit() {
    this.isAuthenticatedSubscription = this.store.pipe(select(selectAuthIsAuthenticated)).subscribe((isAuthenticated: boolean) => {
      if (isAuthenticated) {
        this.isAuthenticated = true;
      } else  {
        this.isAuthenticated = false;
        this.router.navigate(['/courses/cart']);
      }
    });
    this.userSubscription = this.store.pipe(select(selectAuthUser)).subscribe((user: User) => {
      if (user) {
        this.user = user;
      }
    });
    this.coursesSubscription = this.coursesService.getUserCourses(0, 12).subscribe((courses: Course[]) => {
      if (courses && courses.length > 0) {
        this.courses = courses;
      }
    });
  }

  ngOnDestroy() {
    this.isAuthenticatedSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
    this.coursesSubscription.unsubscribe();
  }

}
