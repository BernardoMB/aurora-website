import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { State } from '../../../../store/state';
import { selectAuthUser } from '../../../../store/auth/auth.selectors';
import { Subscription, Subject, Observable, of } from 'rxjs';
import { User, IPurchasedCourse } from '../../../../shared/models/user.model';
import { Course } from '../../../../shared/models/course.model';
import { ActivatedRoute, UrlSegment, Router, NavigationEnd, Event } from '@angular/router';
import { completeLesson, addCourseToFavorites, removeCourseFromFavorites } from '../../../../store/auth/auth.actions';
import { filter, throttleTime, mergeMap, scan, map, tap } from 'rxjs/operators';
import * as html2canvas from 'html2canvas';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { IReview } from '../../interfaces/IReview';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { ReviewModalComponent } from '../../components/review-modal/review-modal.component';
import { CoursesService } from '../../services/courses.service';
import { Review } from '../../../../shared/models/review.model';

@Component({
  selector: 'app-learn',
  templateUrl: './learn.component.html',
  styleUrls: ['./learn.component.scss'],
})
export class LearnComponent implements OnInit, OnDestroy {
  routeFragmentSubscription: Subscription; // To set the current tab
  currentTab = 'about'; // Default tab when page loads
  routerSubscription: Subscription;
  urlSubscription: Subscription;
  relatedCourses: Course[];
  course: Course;
  userSubscription: Subscription;
  user: User;
  userProgress: string[]; // Array of lessons
  lessonIds: string[];
  currentLessonId: string;
  showPrevButton = false;
  showNextButton = true;
  showCertificate = false;
  canRateCourse = false;
  userReview: IReview;
  isFavorite = false;

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
    private store: Store<State>,
    private route: ActivatedRoute,
    private router: Router,
    private reviewDialog: MatDialog,
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
        // console.log('Scrolling to top');
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

    const data = this.route.snapshot.data;
    // console.log('%c Activated route snapshot resolved data ', 'background: #222; color: #bada55');
    // console.log(data);
    if (data.learningInfo) {
      const learningInfo: { course: Course, userProgress: string[], relatedCourses: Course[] } = data.learningInfo;
      this.course = learningInfo.course;
      this.lessonIds = (learningInfo.course.lessons as any[]).map(lesson => lesson.id);
      this.userProgress = learningInfo.userProgress;
      this.relatedCourses = learningInfo.relatedCourses;
      // #region Reviews infinite scroll
      // console.log('Fetching first reviews page');
      const value = { courseId: learningInfo.course.id, offset: 0 };
      // console.log('Nexting new value', value);
      this.offset.next(value);
      // #endregion
    }

    // Lesson id in route logic
    // * Function
    const updateCurrentLessonState = () => {
      if (this.route.firstChild) {
        this.urlSubscription = this.route.firstChild.url.subscribe((childUrl: UrlSegment[]) => {
          if (childUrl && childUrl[1] && this.lessonIds.length > 0) {
            const lessonId = childUrl[1].path;
            this.currentLessonId = lessonId;
            const index = this.lessonIds.indexOf(lessonId);
            index === 0 ? this.showPrevButton = false : this.showPrevButton = true;
            index === this.lessonIds.length - 1 ? this.showNextButton = false : this.showNextButton = true;
            if (this.lessonIds.indexOf(lessonId) === this.lessonIds.length - 1 && this.userProgress.indexOf(lessonId) === -1) {
              // Navigated to last lesson of the course and user has not yet completed this lesson.
              this.store.dispatch(completeLesson({ courseId: this.course.id, lessonId }));
            }
          }
        });
      } else {
        // console.log(`LearnComponent: No route first child url. LessonId not imputed on router.`);
        if (this.lessonIds && this.lessonIds.length > 0) {
          const lessonId = this.lessonIds[0];
          console.log(`LearnComponent:  Redirecting to /lesson/${lessonId}.`);
          this.router.navigate(['lesson', lessonId], { relativeTo: this.route });
        } else {
          alert('Course has no lessons');
        }
      }
    };
    updateCurrentLessonState();
    this.routerSubscription = this.router.events.pipe(
      filter((event: Event) => {
        return event instanceof NavigationEnd;
      })
    ).subscribe((event: NavigationEnd) => {
      updateCurrentLessonState();
    });

    this.userSubscription = this.store.pipe(select(selectAuthUser)).subscribe((user: User) => {
      if (user) {
        this.user = user;
        // Up to this point the user is enrolled

        // Determine user progress
        const purchasedCourse = user.purchasedCourses.find((el: IPurchasedCourse) => el.course === this.course.id);
        if (purchasedCourse) {
          const userProgress = purchasedCourse.progress;
          this.userProgress = userProgress; // Update user progress
          if (userProgress.length === this.course.lessons.length) {
            // console.log('User has completed this course');
            this.showCertificate = true;
          } else {
            // console.log('User not yet completed this course');
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

        // Determine if course is on user's favorite courses
        const favoriteCourseId = user.favoriteCourses.find((id: string) => id === this.course.id);
        if (favoriteCourseId) {
          this.isFavorite = true;
        } else {
          this.isFavorite = false;
        }

        // TODO: Determine if the user is able to add this course to its wishlist
        // TODO: Determine if the user is able to archive this course
      } else {
        this.canRateCourse = false;
      }
    });
  }

  ngOnDestroy() {
    this.routeFragmentSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
    this.routerSubscription.unsubscribe();
    if (this.urlSubscription) {
      this.urlSubscription.unsubscribe();
    }
  }

  lessonCompleted(lessonId: string): boolean {
    if (this.userProgress) {
      const found = this.userProgress.find(el => el === lessonId);
      if (found) {
        return true;
      }
      return false;
    }
    return false;
  }

  goToPrevLesson() {
    const index = this.lessonIds.indexOf(this.currentLessonId);
    const targetLessonId = this.lessonIds[index - 1];
    console.log(`LearnComponent: Go to prev lesson. Redirecting to /lesson/${targetLessonId}`);
    this.router.navigate(['lesson', targetLessonId], { relativeTo: this.route });
  }

  goToNextLesson() {
    const index = this.lessonIds.indexOf(this.currentLessonId);
    const targetLessonId = this.lessonIds[index + 1];
    console.log(`LearnComponent: Go to next lesson. Redirecting to /lesson/${targetLessonId}`);
    this.router.navigate(['lesson', targetLessonId], { relativeTo: this.route });
    if (this.userProgress.indexOf(this.currentLessonId) === -1) {
      this.store.dispatch(completeLesson({ courseId: this.course.id, lessonId: this.currentLessonId }));
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
    console.log(`LearnComponent: Navigating to lesson/${lessonId}`);
    this.router.navigate(['lesson/', lessonId], { relativeTo: this.route });
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
    this.store.dispatch(addCourseToFavorites({ courseId: this.course.id, userId: this.user.id }));
  }

  onUnfavoriteCourse() {
    // console.log('Dispatching action removeCourseFromFavorites');
    this.store.dispatch(removeCourseFromFavorites({ courseId: this.course.id, userId: this.user.id }));
  }

}
