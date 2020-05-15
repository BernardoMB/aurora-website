import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { State } from '../../../../store/state';
import { User, IPurchasedCourse } from '../../../../shared/models/user.model';
import { selectAuthUser, selectAuthIsAuthenticated, selectAuthCart } from '../../../../store/auth/auth.selectors';
import { Subscription, Observable, of, Subject } from 'rxjs';
import { Course } from '../../../../shared/models/course.model';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { LoginFormComponent } from '../../../../components/login-form/login-form.component';
import { SignupFormComponent } from '../../../../components/signup-form/signup-form.component';
import { addCourseToCart, pushCourseToCarts, addCourseToFavorites, removeCourseFromFavorites, addCourseToWishlist, removeCourseFromWishlist, addCourseToArchive, removeCourseFromArchive } from '../../../../store/auth/auth.actions';
import { CookieService } from 'ngx-cookie-service';
import * as html2canvas from 'html2canvas';
import { ReviewModalComponent } from '../../components/review-modal/review-modal.component';
import { CoursesService } from '../../services/courses.service';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { throttleTime, mergeMap, tap, map, scan } from 'rxjs/operators';
import * as faker from 'faker';
import { IReview } from '../../interfaces/IReview';
import { Review } from '../../../../shared/models/review.model';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss'],
})
export class CourseDetailComponent implements OnInit, OnDestroy {
  routeFragmentSubscription: Subscription;
  routeDataSubscription: Subscription;
  isFavorite = false;
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
  userReview: IReview;
  showWishlistButton = true;
  canAddToWishlist = true;
  showArchiveButton = false;
  canArchiveCourse = true;
  get enrolled() {
    if (this.user && this.course) {
      if (this.course.enrolledUsers.indexOf(this.user.id) !== -1) {
        return true;
      }
    }
    return false;
  }

  // #region Reviews infinite scroll
  @ViewChild(CdkVirtualScrollViewport)
  viewport: CdkVirtualScrollViewport;
  batch = 5;
  theEnd = false;
  offset = new Subject();
  infinite: Observable<any[]>;
  infiniteSubscription: Subscription;
  reviews: IReview[] = [];
  createdReview: IReview;
  // #endregion

  constructor(
    private readonly route: ActivatedRoute,
    private router: Router,
    private store: Store<State>,
    private loginDialog: MatDialog,
    private signupDialog: MatDialog,
    private reviewDialog: MatDialog,
    private cookieService: CookieService,
    private coursesService: CoursesService
  ) {
    // Scroll to top
    this.router.events.subscribe(event => {
      // console.log('Navigation event:', event);
      if (event instanceof NavigationEnd) {
        // Prevent scrolling if changed tab.
        const fragment = event.url.split('#')[1];
        if (fragment) {
          return;
        }
        window.scrollTo(0, 0);
      }
      return;
    });

    // #region Reviews infinite scroll
    const batchMap = this.offset.pipe(
      throttleTime(500),
      mergeMap((value: { courseId: string, offset: number }) => {
        // console.log('Emmited new value', value);
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
    this.infiniteSubscription = this.infinite.subscribe((arr: IReview[]) => {
      // console.log('Got reviews array', arr);
      if (arr.length > 0) {
        if (this.createdReview) {
          this.reviews = [
            this.createdReview,
            ...arr
          ];
        } else {
          this.reviews = [
            ...arr
          ];
        }
      }
    });
    // #endregion

    // Set the current tab getting rote fragment if any
    this.routeFragmentSubscription = this.route.fragment.subscribe((fragment: string) => {
      if (fragment) {
        this.currentTab = fragment;
      }
    });
  }

  ngOnInit() {
    this.routeDataSubscription = this.route.data.subscribe((data) => {
      if (data.courseDetailInfo) {
        const courseDetailInfo: { course: Course, userProgress: string[], relatedCourses: Course[] } = data.courseDetailInfo;
        this.course = courseDetailInfo.course;
        this.relatedCourses = courseDetailInfo.relatedCourses;
        // #region Cart logic
        this.store.pipe(select(selectAuthCart)).subscribe((cart: any[]) => {
          if (cart && cart.length > 0) {
            cart.map((el: Course) => {
              return el.id;
            }).indexOf(courseDetailInfo.course.id) !== -1 ? this.showGoToCart = true : this.showGoToCart = false;
          } else {
            this.showGoToCart = false;
          }
        });
        // #endregion
        // #region Reviews infinite scroll
        // console.log('Fetching first reviews page');
        const value = { courseId: data.courseDetailInfo.course.id, offset: 0 };
        // console.log('Nexting new value', value);
        this.offset.next(value);
        // #endregion
      }
    });

    this.userSubscription = this.store.pipe(select(selectAuthUser)).subscribe((user: User) => {
      if (user) {
        this.user = user;
        this.showCertificateTab = true;

        // Determine if user is enrolled
        const userId = this.course.enrolledUsers.find((id: string) => id === this.user.id);
        if (userId) {
          // User is enrolled
          this.showWishlistButton = false;
          this.showArchiveButton = true;

          // Determine user progress
          const purchasedCourse = user.purchasedCourses.find((el: IPurchasedCourse) => el.course === this.course.id);
          if (purchasedCourse) {
            const userProgress = purchasedCourse.progress;
            if (userProgress.length === this.course.lessons.length) {
              // User has completed this course
              this.showCertificate = true;
            } else {
              // User not yet completed this course
              this.showCertificate = false;
            }
          }

          // Determine if the user is able to add review
          const review = (this.course.reviews as Review[]).find((r: Review) => r.user === this.user.id);
          if (review) {
            // User has already reviwed this course
            this.canRateCourse = false;
            this.userReview = {
              user: {
                name: user.name,
                lastName: user.lastName
              },
              rating: (review as any).rating,
              review: (review as any).review,
            };
          } else {
            // User has not yet reviwed this course
            this.canRateCourse = true;
          }
        }

        // Determine if course is in user's favorite courses
        const favoriteCourseId = user.favoriteCourses.find((id: string) => id === this.course.id);
        if (favoriteCourseId) {
          this.isFavorite = true;
        } else {
          this.isFavorite = false;
        }

        // Determine if course is user's wishlist
        const wishedCourseId = user.wishList.find((id: string) => id === this.course.id);
        if (wishedCourseId) {
          this.canAddToWishlist = false;
        } else {
          this.canAddToWishlist = true;
        }

        // Determine if course is user's wishlist
        const archivedCourseId = user.archivedCourses.find((id: string) => id === this.course.id);
        if (archivedCourseId) {
          this.canArchiveCourse = false;
        } else {
          this.canArchiveCourse = true;
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
    this.routeDataSubscription.unsubscribe();
    this.routeFragmentSubscription.unsubscribe();
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
            // console.log('Course', this.course);

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
            this.reviews = [
              createdReview,
              ...this.reviews
            ];
          }
        });
      }
    });
  }

  // Reviews infinite scroll
  getBatch(courseId, offset) {
    // console.log(`Fetching batch. CourseId: ${courseId}, Offset: ${offset}`);
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
    // console.log('ScrollIndexChanged. Event:', e);
    if (this.theEnd) {
      // console.log('There are no more reviews to fetch');
      return;
    }
    const end = this.viewport.getRenderedRange().end;
    const total = this.viewport.getDataLength();
    // console.log(`${end}, '>=', ${total}`);
    if (end === total) {
      // console.log('All fetched elements were rendered. Asking for more elements. Offset:', offset);
      const value = { courseId: this.course.id, offset };
      // console.log('Nexting value', value);
      this.offset.next(value);
    }
  }

  trackByIdx(i) {
    return i;
  }

  // Favorite courses

  onFavoriteCourse() {
    if (this.isAuthenticated) {
      this.store.dispatch(addCourseToFavorites({ courseId: this.course.id, userId: this.user.id }));
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
            const userSub = this.store.pipe(select(selectAuthUser)).subscribe((user: User) => {
              if (user) {
                const favoriteCourseId = user.favoriteCourses.find((id: string) => id === this.course.id);
                if (!favoriteCourseId) {
                  this.store.dispatch(addCourseToFavorites({ courseId: this.course.id, userId: user.id }));
                }
              }
            });
            userSub.unsubscribe();
          }
        }
      });
    }
  }

  onUnfavoriteCourse() {
    this.store.dispatch(removeCourseFromFavorites({ courseId: this.course.id, userId: this.user.id }));
  }

  // Wishlist courses

  onAddToWishlist() {
    if (this.isAuthenticated) {
      this.store.dispatch(addCourseToWishlist({ courseId: this.course.id, userId: this.user.id }));
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
            const userSub = this.store.pipe(select(selectAuthUser)).subscribe((user: User) => {
              if (user) {
                const wishedCourseId = user.wishList.find((id: string) => id === this.course.id);
                if (!wishedCourseId) {
                  this.store.dispatch(addCourseToWishlist({ courseId: this.course.id, userId: user.id }));
                }
              }
            });
            userSub.unsubscribe();
          }
        }
      });
    }
  }

  onRemoveFromWishlist() {
    this.store.dispatch(removeCourseFromWishlist({ courseId: this.course.id, userId: this.user.id }));
  }

  // Archive courses

  onArchiveCourse() {
    this.store.dispatch(addCourseToArchive({ courseId: this.course.id, userId: this.user.id }));
  }

  onUnarchiveCourse() {
    this.store.dispatch(removeCourseFromArchive({ courseId: this.course.id, userId: this.user.id }));
  }

}
