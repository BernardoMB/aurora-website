import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { State } from '../../../../store/state';
import { User, IPurchasedCourse } from '../../../../shared/models/user.model';
import { selectAuthUser, selectAuthIsAuthenticated } from '../../../../store/auth/auth.selectors';
import { Subscription, BehaviorSubject, Observable } from 'rxjs';
import { Course } from '../../../../shared/models/course.model';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { LoginFormComponent } from '../../../../components/login-form/login-form.component';
import { SignupFormComponent } from '../../../../components/signup-form/signup-form.component';
import { addCourseToCart, pushCourseToCarts } from '../../../../store/auth/auth.actions';
import { CookieService } from 'ngx-cookie-service';
import * as html2canvas from 'html2canvas';
import { ReviewModalComponent } from '../../components/review-modal/review-modal.component';
import { CoursesService } from '../../services/courses.service';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { throttleTime, mergeMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss'],
})
export class CourseDetailComponent implements OnInit, OnDestroy {
  @ViewChild(CdkVirtualScrollViewport, { static: false }) reviewsViewport: CdkVirtualScrollViewport;

  // TODO: this should be computed from the info obtained from the server
  isFavorite: boolean;
  currentTab = 'about';
  showCertificateTab = false;
  userSubscription: Subscription;
  user: User;
  isAuthenticatedSubscription: Subscription;
  isAuthenticated = false;
  course: Course;
  relatedCourses: Course[];
  showGoToCart = false;
  showCertificate = false;
  canRateCourse = false;
  get enrolled() {
    if (this.user && this.course) {
      if (this.course.enrolledUsers.indexOf(this.user.id) !== -1) {
        return true;
      }
    }
    return false;
  }
  // Paginated reviews
  reviewsSubscription: Subscription;
  reviews = [];
  reviewsPageSize = 10;
  reviewsEnd = false;
  reviewsOffset = new BehaviorSubject(null);
  infinite: Observable<any[]>;

  constructor(
    private router: Router,
    private store: Store<State>,
    private readonly route: ActivatedRoute,
    private loginDialog: MatDialog,
    private signupDialog: MatDialog,
    private reviewDialog: MatDialog,
    private cookieService: CookieService,
    private coursesService: CoursesService
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

    // Reviews pagination
    const pageMap = this.reviewsOffset.pipe(
      throttleTime(500),
      tap((value: { courseId: string, offset: number }) => {

        this.getReviewsPage(value.courseId, value.offset);
      })
    );
  }

  ngOnInit() {
    this.route.data.subscribe((data: { learningInfo: { course: Course, userProgress: string[], relatedCourses: Course[] } }) => {
      if (data.learningInfo) {
        this.course = data.learningInfo.course;
        this.relatedCourses = data.learningInfo.relatedCourses;

        // Reviews infite scroll pagination.
        // TODO: Implement reviews type.
        /* this.reviewsSubscription = this.coursesService.getCourseReviews(data.learningInfo.course.id, 0, this.reviewsPageSize)
          .subscribe((reviews: any[]) => {
            if (reviews && reviews.length > 0) {
              this.reviews = reviews;
              if (reviews.length === data.learningInfo.course.reviews.length) {
                this.reviewsEnd = true;
              }
            }
          }); */
        console.log('Getting reviews first page');
        this.getReviewsPage(data.learningInfo.course.id, 0);

      }
    });
    this.userSubscription = this.store.pipe(select(selectAuthUser)).subscribe((user: User) => {
      if (user) {
        this.user = user;
        this.showCertificateTab = true;
        // Determine what to show in the certificate tab
        if (this.course.enrolledUsers.indexOf(this.user.id) !== -1) {
          // User has course
          const purchasedCourses = user.purchasedCourses
            .filter((el: IPurchasedCourse) => el.course === this.course.id);
          if (purchasedCourses.length > 0 ) {
            const purchasedCourse = purchasedCourses[0];
            const userProgress = purchasedCourse.progress;
            if (userProgress.length === this.course.lessons.length) {
              this.showCertificate = true;
            }
          }
        }
        // Determine if the user is able to add review
        // TODO: Implement review type.
        const review = this.course.reviews.find((el: any) => el.user === this.user.id);
        if (review) {
          this.canRateCourse = false;
          const courseReviews = this.course.reviews.filter((el: any) => el.user !== this.user.id);
          courseReviews.push(review);
          /* console.log('COURSE', this.course);
          this.course.reviews = courseReviews; */
          const course = {
            ...this.course,
            reviews: courseReviews
          };
          this.course = course;
        } else {
          this.canRateCourse = true;
        }
      } else {
        this.user = undefined;
        this.showCertificateTab = false;
        this.canRateCourse = false;
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

  async onDownloadCertificate() {
    window.scrollTo(0, 0);
    setTimeout(async () => {
      const canvas = await html2canvas.default(document.querySelector('#certificate'));
      /* document.body.appendChild(canvas); */
      const contentDataURL = canvas.toDataURL('image/png');
      const download = document.createElement('a');
      download.href = contentDataURL;
      download.download = `Invest Naija ${this.course.name} Certificate.png`;
      download.click();
    }, 1);
  }

  navigateToLesson($event: string) {
    const lessonId = $event;
    if (this.enrolled) {
      console.log(`CourseDetailComponent: Navigating to lesson/${lessonId}`);
      this.router.navigate(['./learn/lesson', lessonId], { relativeTo: this.route });
    }
  }

  onRateCourse() {
    // Modal configuration
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'custom-mat-dialog-container';
    dialogConfig.backdropClass = 'custom-modal-backdrop';
    let reviewDialogRef;
    reviewDialogRef = this.reviewDialog.open(ReviewModalComponent, dialogConfig);
    reviewDialogRef.afterClosed().subscribe(result => {
      if (result && result.rating) {
        // TODO: implement review type
        this.coursesService.reviewCourse(this.course.id, result.rating, result.review).subscribe((review: any) => {
          if (review) {
            this.canRateCourse = false;
            const reviews = [
              ...(this.course.reviews),
              review
            ];
            const newTotalReviews = this.course.totalReviews > 0 ? this.course.totalReviews + 1 : 1;
            const newTotalRating = this.course.totalRating ? this.course.totalRating + review.rating : review.rating;
            // tslint:disable-next-line: max-line-length
            const newRating = ((this.course.totalRating ? this.course.totalRating : 0) + review.rating) / ((this.course.totalReviews ? this.course.totalReviews : 0) + 1);
            const course = {
              ...(this.course),
              reviews,
              rating: newRating,
              totalRating: newTotalRating,
              totalReviews: newTotalReviews
            };
            this.course = course; // Esto hace que se actualice la lista de reviews
            console.log('COURSEEEEEE', this.course);
          }
        });
      }
    });
  }

  // Reviews pagination

  nextReviewsPage($event: any, offset: number) {
    console.log('Getting next reviews page. Offset:', offset);
    if (this.reviewsEnd) {
      return;
    }
    const end = this.reviewsViewport.getRenderedRange().end;
    const total = this.reviewsViewport.getDataLength();
    if (end === total) {
      console.log('Emiting new offset value. Offset:', offset);
      this.reviewsOffset.next({ courseId: this.course.id, offset });
    }
  }

  getReviewsPage(courseId: string, offset: number)  {
    this.reviewsSubscription = this.coursesService.getCourseReviews(courseId, offset, this.reviewsPageSize)
      .subscribe((reviews: any[]) => {
        console.log('Reviews:', reviews);
        if (!reviews || reviews.length === 0) {
          console.log('Got no reviews');
          this.reviewsEnd = true;
        }
        if (reviews && reviews.length > 0) {
          console.log('Got reviews. Updating reviews array');
          this.reviews.push(reviews);
        }
      });
  }

  /**
   * Traks the index of the reviews in the array and only renders the ones that change.
   *
   * @param {number} index
   * @param {model} name
   * @returns {number}
   * @memberof CourseDetailComponent
   */
  trackReviewsByIndex(index: number): number {
    return index;
  }

}
