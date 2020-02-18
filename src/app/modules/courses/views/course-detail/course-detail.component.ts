import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute, UrlSegment } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { State } from '../../../../store/state';
import { User } from '../../../../shared/models/user.model';
import { selectAuthUser, selectAuthIsAuthenticated, selectAuthCart } from '../../../../store/auth/auth.selectors';
import { CoursesService } from '../../services/courses.service';
import { Subscription } from 'rxjs';
import { Course } from '../../../../shared/models/course.model';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { LoginFormComponent } from '../../../../components/login-form/login-form.component';
import { SignupFormComponent } from '../../../../components/signup-form/signup-form.component';
import { addCourseToCart, pushCourseToCarts } from '../../../../store/auth/auth.actions';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss'],
})
export class CourseDetailComponent implements OnInit, OnDestroy {
  // TODO: this should be computed from the info obtained from the server
  isFavorite: boolean;

  currentTab = 'about';
  showCertificateTab = false;
  userSubscription: Subscription;
  user: User;
  isAuthenticatedSubscription: Subscription;
  isAuthenticated = false;
  courseSubscription: Subscription;
  course: Course;
  relatedCoursesSubscription: Subscription;
  relatedCourses: Course[];
  showGoToCart = false;
  get enrolled() {
    if (this.user && this.course) {
      if (this.course.enrolledUsers.indexOf(this.user.id) !== -1) {
        return true;
      }
    }
    return false;
  }

  constructor(
    private router: Router,
    private store: Store<State>,
    private readonly route: ActivatedRoute,
    private coursesService: CoursesService,
    private loginDialog: MatDialog,
    private signupDialog: MatDialog,
    private cookieService: CookieService
  ) {
    this.router.events.subscribe(event => {
      /* console.log('Navigation event:', event); */
      if (event instanceof NavigationEnd) {
        // Prevent scrolling if changed tab.
        const second = event.url.split('#')[1];
        if (second) {
          return;
        }
        window.scrollTo(0, 0);
      }
      return;
    });

    this.route.url.subscribe((url: UrlSegment[]) => {
      console.log('Course detail component: Url:', url);
      const courseId = url[0].path;
      this.getCourse(courseId);
    });
  }

  ngOnInit() {
    this.userSubscription = this.store.pipe(select(selectAuthUser)).subscribe((user: User) => {
      if (user) {
        this.user = user;
        this.showCertificateTab = true;
      } else {
        this.user = undefined;
        this.showCertificateTab = false;
      }
    });
    this.isAuthenticatedSubscription = this.store.pipe(select(selectAuthIsAuthenticated)).subscribe((isAuthenticated: boolean) => {
      if (isAuthenticated) {
        this.isAuthenticated = true;
      } else {
        this.isAuthenticated = false;
      }
    });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
    this.isAuthenticatedSubscription.unsubscribe();
    this.courseSubscription.unsubscribe();
    this.relatedCoursesSubscription.unsubscribe();
  }

  getCourse(courseId: string) {
    this.courseSubscription = this.coursesService.getCourse(courseId).subscribe((course: Course) => {
      if (course) {
        this.course = course;
        this.store.pipe(select(selectAuthCart)).subscribe((cart: any[]) => {
          if (cart) {
            if (cart.length > 0) {
              cart.map((el: Course) => {
                return el.id;
              }).indexOf(course.id) !== -1 ? this.showGoToCart = true : this.showGoToCart = false;
            } else {
              this.showGoToCart = false;
            }
          }
        });
        // TODO: Change the code below to fetch category featured courses instead of category courses.
        this.relatedCoursesSubscription = this.coursesService.getCategoryCourses(course.category.id).subscribe((courses: Course[]) => {
          if (courses && courses.length > 0) {
            this.relatedCourses = courses;
          }
        });
      }
    });
  }

  onAddToCart(courseId: string) {
    if (this.isAuthenticated) {
      this.store.dispatch(addCourseToCart({ courseId, userId: this.user.id }));
    } else {
      let courseIds: string[] = [];
      const cartCookie: string = this.cookieService.get('cartCookie');
      if (cartCookie) {
        courseIds = JSON.parse(cartCookie);
      }
      courseIds.push(this.course.id);
      this.cookieService.delete('cartCookie');
      this.cookieService.set('cartCookie', JSON.stringify(courseIds));
      this.store.dispatch(pushCourseToCarts({ course: this.course }));
    }
  }

  onBuyNow() {
    if (this.isAuthenticated) {
      // tslint:disable-next-line: max-line-length
      console.log(`CourseDetailComponent: Authenticated state is true, Redirecting to /courses/cart/checkout/express/course/${this.course.id}`);
      this.router.navigate([`/courses/cart/checkout/express/course/${this.course.id}`]);
    } else {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.panelClass = 'custom-mat-dialog-container';
      dialogConfig.backdropClass = 'custom-modal-backdrop';
      let loginDialogRef;
      let signupDialogRef;
      loginDialogRef = this.loginDialog.open(LoginFormComponent, dialogConfig);
      loginDialogRef.afterClosed().subscribe(result => {
        if (result) {
          if (result.showSignUpModalOnClose) {
            signupDialogRef = this.signupDialog.open(SignupFormComponent, dialogConfig);
          }
          if (this.isAuthenticated) {
            let index = 0;
            let found = false;
            while (index < this.user.courses.length && !found) {
                if (this.user.courses[index] === this.course.id) {
                    found = true;
                }
                index++;
            }
            if (!found) {
              // tslint:disable-next-line: max-line-length
              console.log(`CourseDetailComponent: Authenticated state is true, Redirecting to /courses/cart/checkout/express/course/${this.course.id}`);
              this.router.navigate([`/courses/cart/checkout/express/course/${this.course.id}`]);
            }
          }
        }
      });
    }
  }

}
