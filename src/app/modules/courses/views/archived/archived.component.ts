import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../../../../shared/models/user.model';
import { Course } from '../../../../shared/models/course.model';
import { Store, select } from '@ngrx/store';
import { AuthState } from '../../../../store/auth/auth.state';
import { Router } from '@angular/router';
import { CoursesService } from '../../services/courses.service';
import { selectAuthIsAuthenticated, selectAuthUser } from '../../../../store/auth/auth.selectors';

@Component({
  selector: 'app-archived',
  templateUrl: './archived.component.html',
  styleUrls: ['./archived.component.scss']
})
export class ArchivedComponent implements OnInit, OnDestroy {

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
        this.router.navigate(['/courses']);
      }
    });
    this.userSubscription = this.store.pipe(select(selectAuthUser)).subscribe((user: User) => {
      if (user) {
        this.user = user;
      }
    });
    this.coursesSubscription = this.coursesService.getUserArchivedCourses(0, 12).subscribe((courses: Course[]) => {
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
