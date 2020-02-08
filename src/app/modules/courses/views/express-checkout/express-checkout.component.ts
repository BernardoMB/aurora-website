import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../../../../shared/models/user.model';
import { Course } from '../../../../shared/models/course.model';
import { Store, select } from '@ngrx/store';
import { AuthState } from '../../../../store/auth/auth.state';
import { Router, ActivatedRoute, UrlSegment } from '@angular/router';
import { selectAuthIsAuthenticated, selectAuthUser, selectAuthCart } from '../../../../store/auth/auth.selectors';
import { purchaseCart, removeCourseFromCart } from '../../../../store/auth/auth.actions';
import { CoursesService } from '../../services/courses.service';

@Component({
  selector: 'app-express-checkout',
  templateUrl: './express-checkout.component.html',
  styleUrls: ['./express-checkout.component.scss']
})
export class ExpressCheckoutComponent implements OnInit, OnDestroy {
  isAuthenticatedSubscription: Subscription;
  isAuthenticated: boolean;
  userSubscription: Subscription;
  user: User;
  courseSubscription: Subscription;
  course: Course;
  get subtotal() {
    if (this.course) {
      return this.course.price;
    }
    return 0;
  }
  get total() {
    if (this.course) {
      return this.course.price * (1 - this.course.discount);
    }
    return 0;
  }

  constructor(
    private store: Store<AuthState>,
    private router: Router,
    private route: ActivatedRoute,
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
    this.route.url.subscribe((url: UrlSegment[]) => {
      const courseId = url[4].path;
      if (courseId) {
        this.courseSubscription = this.coursesService.getCourse(courseId).subscribe((course: Course) => {
          if (course) {
            this.course = course;
          }
        });
      }
    });
  }

  ngOnDestroy() {
    this.courseSubscription.unsubscribe();
    this.isAuthenticatedSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }

  onCompletePayment() {
    alert('Implement this functionality');
    /* this.store.dispatch(purchaseCourse({ courses: courseIds, userId: this.user.id })); */
  }

  onRemoveFromOrder(course: Course) {
    this.router.navigate([`/courses/${this.course.id}`]);
  }
}
