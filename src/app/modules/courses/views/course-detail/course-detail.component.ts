import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { State } from '../../../../store/state';
import { User, IPurchasedCourse } from '../../../../shared/models/user.model';
import { selectAuthUser, selectAuthIsAuthenticated } from '../../../../store/auth/auth.selectors';
import { Subscription, BehaviorSubject, Observable, of, Subject } from 'rxjs';
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
import { throttleTime, mergeMap, tap, map, scan } from 'rxjs/operators';
import * as faker from 'faker';
import { IReview } from '../../interfaces/IReview';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss'],
})
export class CourseDetailComponent implements OnInit, OnDestroy {
  /* @ViewChild(CdkVirtualScrollViewport, { static: false }) reviewsViewport: CdkVirtualScrollViewport; */

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
  showGoToCart = false; // TODOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO: Super importante! (revisar el history de este archivo)
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

  // Reviews infinite scroll
  @ViewChild(CdkVirtualScrollViewport, { static: false })
  viewport: CdkVirtualScrollViewport;
  reviews2;
  batch = 5;
  theEnd = false;
  offset = new Subject();
  infinite: Observable<any[]>;
  infiniteSubscription: Subscription;
  reviews3: IReview[] = [];
  createdReview: IReview;

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

    // Reviews infinite scroll
    const batchMap = this.offset.pipe(
      throttleTime(500),
      mergeMap((value: { courseId: string, offset: number }) => {
        console.log('Emmited new value', value);
        if (value) {

          return this.getBatch(value.courseId, value.offset);
        } else {
          return of();
        }
      }),
      scan((acc, batch) => {
        return { ...acc, ...batch };
      }, {})
    );
    this.infinite = batchMap.pipe(map(v => Object.values(v)));
    this.infiniteSubscription = this.infinite.subscribe((arr) => {
      console.log('Got array', arr);
      if (arr.length > 0) {
        if (this.createdReview) {
          this.reviews3 = [
            this.createdReview,
            ...arr
          ];
        } else {
          this.reviews3 = [
            ...arr
          ];
        }
      }
    });
  }

  ngOnInit() {
    this.route.data.subscribe((data: { learningInfo: { course: Course, userProgress: string[], relatedCourses: Course[] } }) => {
      if (data.learningInfo) {
        this.course = data.learningInfo.course;
        this.relatedCourses = data.learningInfo.relatedCourses;

        console.log('Fetching first reviews page');
        /* this.coursesService.getCourseReviews(data.learningInfo.course.id, 0, this.batch).pipe(
          tap((reviews: any[]) => {
            reviews.length ? null : this.theEnd = true;
          }),
          map((reviews: any[]) => {
            return reviews.reduce((acc, review) => {
              const id = review.id;
              const reviewData = {
                review: review.review,
                rating: review.rating,
                user: {
                  name: review.user.name,
                  lastName: review.user.lastName
                }
              };
              return { ...acc, [id]: reviewData };
            }, {});
          }),
          scan((acc, batch) => {
            return { ...acc, ...batch };
          }, {}),
          map(v => Object.values(v))
        ).subscribe((reviews: Array<IReview>) => {
          console.log('First page', reviews);
          if (reviews) {
            this.reviews3 = reviews;
          }
        }); */
        console.log('Nexting new value');
        this.offset.next({ courseId: data.learningInfo.course.id, offset: 0 });
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

            // Option 1: no pagination
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


            // TODO: Lo de arriba se tiene que modificar
            const createdReview = {
              rating: review.rating,
              review: review.review,
              user: {
                name: this.user.name,
                lastName: this.user.lastName
              }
            };
            this.createdReview = createdReview;
            this.reviews3 = [
              createdReview,
              ...this.reviews3
            ];
          }
        });
      }
    });
  }

  // Reviews infinite scroll
  getBatch(courseId, offset) {
    console.log(`Fetching batch. CourseId: ${courseId}, Offset: ${offset}`);
    // #region
    /* return of(
      {
        [Math.trunc(Math.random() * 1000000)]: {
          review: 'Review ' + Math.trunc(Math.random() * 1000),
          rating: Math.floor(Math.random() * 5) + 1,
          user: {
            name: 'Name ' + Math.trunc(Math.random() * 1000),
            lastName: 'LastName ' + Math.trunc(Math.random() * 10000),
          }
        }
      },
      {
        [Math.trunc(Math.random() * 1000000)]: {
          review: 'Review ' + Math.trunc(Math.random() * 1000),
          rating: Math.floor(Math.random() * 5) + 1,
          user: {
            name: 'Name ' + Math.trunc(Math.random() * 1000),
            lastName: 'LastName ' + Math.trunc(Math.random() * 10000),
          }
        }
      },
      {
        [Math.trunc(Math.random() * 1000000)]: {
          review: 'Review ' + Math.trunc(Math.random() * 1000),
          rating: Math.floor(Math.random() * 5) + 1,
          user: {
            name: 'Name ' + Math.trunc(Math.random() * 1000),
            lastName: 'LastName ' + Math.trunc(Math.random() * 10000),
          }
        }
      },
      {
        [Math.trunc(Math.random() * 1000000)]: {
          review: `Hello,
          Up to section 17 inclusive, I considered it the best course after which I learned.
          From section 18, it became very confusing to me. Different and very complicated compared to what I learned about the REST API.
          You certainly do not need my suggestion, but I would recommend a collaboration with someone who implements the back-end part in EF Core 3.0 or Spring Boot, and then from my point of view the course would become extremely useful. I understand that the back end is not the subject of the course, but in this style, I could not actually associate with what I already knew / used about the REST API. It's just my personal opinion.`,
          rating: Math.floor(Math.random() * 5) + 1,
          user: {
            name: 'Name ' + Math.trunc(Math.random() * 1000),
            lastName: 'LastName ' + Math.trunc(Math.random() * 10000),
          }
        }
      },
      {
        [Math.trunc(Math.random() * 1000000)]: {
          review: 'Review ' + Math.trunc(Math.random() * 1000),
          rating: Math.floor(Math.random() * 5) + 1,
          user: {
            name: 'Name ' + Math.trunc(Math.random() * 1000),
            lastName: 'LastName ' + Math.trunc(Math.random() * 10000),
          }
        }
      },
    ); */
    // #endregion
    return this.coursesService.getCourseReviews(courseId, offset, this.batch).pipe(
      tap((reviews: any[]) => {
        reviews.length ? null : this.theEnd = true;
      }),
      map((reviews: any[]) => {
        return reviews.reduce((acc, review) => {
          const id = review.id;
          const data = {
            review: review.review,
            rating: review.rating,
            user: {
              name: review.user.name,
              lastName: review.user.lastName
            }
          };
          return { ...acc, [id]: data };
        }, {});
      })
    );
  }

  nextBatch(e, offset) {
    console.log('ScrollIndexChanged. Event:', e);
    if (this.theEnd) {
      console.log('There are no more reviews to fetch');
      return;
    }
    const end = this.viewport.getRenderedRange().end;
    const total = this.viewport.getDataLength();
    console.log(`${end}, '>=', ${total}`);
    if (end === total) {
      console.log('All fetched elements were rendered. Asking for more elements. Offset:', offset);
      const value = { courseId: this.course.id, offset };
      console.log('Nexting value', value);
      this.offset.next(value);
    }
  }

  trackByIdx(i) {
    return i;
  }

  onCicked() {
    console.log('Elements in the array', this.reviews3.length);
  }

}
