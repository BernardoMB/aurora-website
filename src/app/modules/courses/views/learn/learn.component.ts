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
import { QuizzesService } from '../../services/quizzes.service';

@Component({
  selector: 'app-learn',
  templateUrl: './learn.component.html',
  styleUrls: ['./learn.component.scss'],
})
export class LearnComponent implements OnInit, OnDestroy {
  selectedTabIndex = 0;
  routeFragmentSubscription: Subscription; // To set the current tab
  currentTab = 'about'; // Default tab when page loads
  routerSubscription: Subscription;
  urlSubscription: Subscription;
  userSubscription: Subscription;
  user: User;
  userProgress: string[]; // Array of lessons
  course: Course;
  lessonIds: string[];
  currentLessonId: string;

  // ! Here
  courseObjectIds: string[];
  currentCourseObjectId: string;
  currentCourseObject: any;

  relatedCourses: Course[];
  userReview: IReview;
  canRateCourse = false;
  showPrevButton = false;
  showNextButton = true;
  showCertificate = false;
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

  dummyArr = [];
  constructor(
    private store: Store<State>,
    private route: ActivatedRoute,
    private router: Router,
    private reviewDialog: MatDialog,
    private coursesService: CoursesService,
    public quizzesService: QuizzesService
  ) {
    for (let i = 0; i <= 100; i++) {
      this.dummyArr.push(`Hello ${i}`);
    }





    // Stop scroll when route #fragment change
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
        return { ...acc, ...(batch as any) };
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
        switch (fragment) {
          case 'about':
            this.selectedTabIndex = 0;
            break;
          case 'lessons':
            this.selectedTabIndex = 1;
            break;
          case 'reviews':
            this.selectedTabIndex = 2;
            break;
          case 'certificate':
            this.selectedTabIndex = 3;
            break;
          default:
            this.selectedTabIndex = 0;
            break;
        }

        // Tabs old logic (instead of the switch)
        // this.currentTab = fragment;
      }
    });


  }

  ngOnInit() {

    const data = this.route.snapshot.data;
    if (data.learningInfo) {
      // console.log('%cLearnComponent: learningInfo', 'background: greenyellow; color: #ff25e5', data.learningInfo);
      const learningInfo: { course: Course, userProgress: string[], relatedCourses: Course[] } = data.learningInfo;
      this.course = learningInfo.course;
      this.lessonIds = (learningInfo.course.lessons as any[]).map(lesson => lesson.id);

      // ! Here;
      this.courseObjectIds = (learningInfo.course.courseObjects as any[]).map(courseObject => courseObject.courseObject.id);

      this.userProgress = learningInfo.userProgress;
      this.relatedCourses = learningInfo.relatedCourses;

      // #region Reviews infinite scroll
      // console.log('Fetching first reviews page');
      const value = { courseId: learningInfo.course.id, offset: 0 };
      // console.log('Nexting new value', value);
      this.offset.next(value);
      // #endregion
    }

    // Lesson/Quizes id in route logic
    // * Function
    /* const updateCurrentLessonState = () => {
      if (this.route.firstChild) {
        this.urlSubscription = this.route.firstChild.url.subscribe((childUrl: UrlSegment[]) => {
          if (childUrl && childUrl[1] && this.lessonIds.length > 0) {
            const lessonId = childUrl[1].path;
            this.currentLessonId = lessonId;
            const index = this.lessonIds.indexOf(lessonId);

            index === this.lessonIds.length - 1 ? this.showNextButton = false : this.showNextButton = true;
            index === 0 ? this.showPrevButton = false : this.showPrevButton = true;

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
    }; */

    // ! Here
    const updateCurrentObjectsState = () => {
      if (this.route.firstChild) {
        this.urlSubscription = this.route.firstChild.url.subscribe((childUrl: UrlSegment[]) => {
          if (childUrl && childUrl[1] && this.courseObjectIds.length > 0) {
            const courseObjectId = childUrl[1].path;
            this.currentCourseObjectId = courseObjectId;
            const index = this.courseObjectIds.indexOf(courseObjectId);
            index === this.courseObjectIds.length - 1 ? this.showNextButton = false : this.showNextButton = true;
            index === 0 ? this.showPrevButton = false : this.showPrevButton = true;
            if (this.courseObjectIds.indexOf(courseObjectId) === this.courseObjectIds.length - 1 && this.userProgress.indexOf(courseObjectId) === -1) {
              // Navigated to last lesson of the course and user has not yet completed this lesson.
              console.log('Completing course object...');
              // ! TODO: create complete course object actions and store flow
              this.store.dispatch(completeLesson({ courseId: this.course.id, lessonId: courseObjectId }));
            }
          }
        });
      } else {
        // console.log(`LearnComponent: No route first child url. courseObjectId not imputed on router.`);
        if (this.courseObjectIds && this.courseObjectIds.length > 0) {
          const courseObjectId = this.courseObjectIds[0];
          const courseObject = this.course.courseObjects.filter((courseObj) => courseObj.courseObject.id === courseObjectId)[0];
          if (courseObject.type === 'LESSON') {
            console.log(`LearnComponent:  Redirecting to /lesson/${courseObjectId}.`);
            this.router.navigate(['lesson', courseObjectId], { relativeTo: this.route });
          } else if (courseObject.type === 'QUIZ') {
            console.log(`LearnComponent:  Redirecting to /quiz/${courseObjectId}.`);
            this.router.navigate(['quiz', courseObjectId], { relativeTo: this.route });
          }
        } else {
          alert('Course has no courseObjects');
        }
      }
    };

    // updateCurrentLessonState();
    updateCurrentObjectsState(); // ! Here
    this.routerSubscription = this.router.events.pipe(
      filter((event: Event) => {
        return event instanceof NavigationEnd;
      })
    ).subscribe((event: NavigationEnd) => {
      // updateCurrentLessonState();
      updateCurrentObjectsState(); // ! Here
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
          /* if (userProgress.length === this.course.lessons.length) {
            // console.log('User has completed this course');
            this.showCertificate = true;
          } else {
            // console.log('User not yet completed this course');
            this.showCertificate = false;
          } */

          // ! Here
          if (userProgress.length === this.course.courseObjects.length) {
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

        // TODO: Determine if the user is able to archive this course (there is already a view and logic for that)
      } else {
        this.canRateCourse = false;
      }
    });

    this.quizzesService.nextCourseObject$.subscribe((goToNextCourseObject: boolean) => {
      if (goToNextCourseObject) {
        this.goToNextCourseObject();
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

  onTabNavigation(tabIndex) {
    const fragments = ['about', 'lessons', 'reviews', 'certificate'];
    console.log(fragments[tabIndex]);
    // This object is the external course object
    const object = this.course.courseObjects.filter((object) => object.courseObject.id === this.currentCourseObjectId)[0];
    let courseObjectType;
    if (object.type === 'LESSON') {
      courseObjectType = 'lesson';
    } else if (object.type === 'QUIZ') {
      courseObjectType = 'quiz';
    }
    this.router.navigate([`./${courseObjectType}/${this.currentCourseObjectId}`], {
      fragment: fragments[tabIndex],
      /* preserveFragment: true, */
      /* skipLocationChange: true, */
      relativeTo: this.route,
      replaceUrl: true,
    });
  }

  onViewCourseObject(object: any) {
    // TODO: Use courseObject type for object argument
    const courseObjectId = object.courseObject.id;
    if (object.type === 'LESSON') {
      console.log(`LearnComponent: Navigating to lesson/${courseObjectId}`);
      this.router.navigate(['lesson/', courseObjectId], { relativeTo: this.route });
    } else if (object.type === 'QUIZ') {
      console.log(`LearnComponent: Navigating to quiz/${courseObjectId}`);
      this.router.navigate(['lesson/', courseObjectId], { relativeTo: this.route });
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

  // ! Here
  objectCompleted(courseObjectId: string): boolean {
    if (this.userProgress) {
      const found = this.userProgress.find(el => el === courseObjectId);
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

  // ! Here
  goToPrevCourseObject() {
    const index = this.courseObjectIds.indexOf(this.currentCourseObjectId);
    const targetCourseObjectId = this.courseObjectIds[index - 1];
    const courseObject = this.course.courseObjects.filter((courseObj) => courseObj.courseObject.id === targetCourseObjectId)[0];
    if (courseObject.type === 'LESSON') {
      console.log(`LearnComponent: Go to prev course object. Redirecting to /lesson/${targetCourseObjectId}.`);
      this.router.navigate(['lesson', targetCourseObjectId], { relativeTo: this.route });
    } else if (courseObject.type === 'QUIZ') {
      console.log(`LearnComponent: Go to prev course object. Redirecting to /quiz/${targetCourseObjectId}.`);
      this.router.navigate(['quiz', targetCourseObjectId], { relativeTo: this.route });
    }
  }

  // ! Here
  goToNextCourseObject() {
    const index = this.courseObjectIds.indexOf(this.currentCourseObjectId);
    console.log('ids', this.courseObjectIds);
    const targetCourseObjectId = this.courseObjectIds[index + 1];

    console.log('target', targetCourseObjectId);
    console.log(this.course.courseObjects);

    const courseObject = this.course.courseObjects.filter((courseObj) => courseObj.courseObject.id === targetCourseObjectId)[0];
    if (courseObject.type === 'LESSON') {
      console.log(`LearnComponent: Go to next course object. Redirecting to /lesson/${targetCourseObjectId}.`);
      this.router.navigate(['lesson', targetCourseObjectId], { relativeTo: this.route });
    } else if (courseObject.type === 'QUIZ') {
      console.log(`LearnComponent: Go to next course object. Redirecting to /quiz/${targetCourseObjectId}.`);
      this.router.navigate(['quiz', targetCourseObjectId], { relativeTo: this.route });
    }
    if (this.userProgress.indexOf(this.currentCourseObjectId) === -1) {
      this.store.dispatch(completeLesson({ courseId: this.course.id, lessonId: this.currentCourseObjectId }));
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

  // TODO: The GUI (template) should call this function to navigate into a course object
  navigateToCourseObject($event: string) {
    const courseObjectId = $event;
    const courseObject = this.course.courseObjects.filter((courseObj) => courseObj.courseObject.id === courseObjectId)[0];
    if (courseObject.type === 'LESSON') {
      console.log(`LearnComponent: Go to course object. Redirecting to /lesson/${courseObjectId}.`);
      this.router.navigate(['lesson', courseObjectId], { relativeTo: this.route });
    } else if (courseObject.type === 'QUIZ') {
      console.log(`LearnComponent: Go to course object. Redirecting to /quiz/${courseObjectId}.`);
      this.router.navigate(['quiz', courseObjectId], { relativeTo: this.route });
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
