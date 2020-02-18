import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { State } from '../../../../store/state';
import { selectAuthUser } from '../../../../store/auth/auth.selectors';
import { Observable, Subscription } from 'rxjs';
import { User, IPurchasedCourse } from '../../../../shared/models/user.model';
import { Course } from '../../../../shared/models/course.model';
import { ActivatedRoute, UrlSegment, Router, NavigationExtras } from '@angular/router';
import { CoursesService } from '../../services/courses.service';

@Component({
  selector: 'app-learn',
  templateUrl: './learn.component.html',
  styleUrls: ['./learn.component.scss'],
})
export class LearnComponent implements OnInit, OnDestroy {
  // TODO: Related courses are not really related courses. Fix this issue.
  relatedCoursesSubscription: Subscription;
  relatedCourses: Course[];
  courseSubscription: Subscription;
  course: Course;
  courseId: string;
  user$: Observable<User>;
  userSubscription: Subscription;
  user: User;
  purchasedCourse: IPurchasedCourse;
  userProgress: string[]; // Array of lessons
  currentTab = 'about'; // Default tab when page loads

  constructor(
    private store: Store<State>,
    private route: ActivatedRoute,
    private coursesService: CoursesService,
    private router: Router
  ) {
    this.route.url.subscribe((url: UrlSegment[]) => {
      console.log('Course detail component: Url:', url);
      const courseId = url[0].path;
      this.courseSubscription = this.coursesService.getCourse(courseId).subscribe((course: Course) => {
        if (course) {
          this.course = course;
          this.user$ = this.store.pipe(select(selectAuthUser));
          this.userSubscription = this.user$.subscribe(user => {
            if (user) {
              const purchasedCourse = user.purchasedCourses.find(
                (el: { progress: string[]; course: string }) =>
                  el.course === this.course.id,
              );
              this.purchasedCourse = purchasedCourse;
              if (purchasedCourse) {
                this.userProgress = purchasedCourse.progress;
                if (purchasedCourse.progress.length > 0) {
                  const progress = purchasedCourse.progress;
                  const lastLessonId = progress[progress.length - 1];
                  console.log(`LearnComponent: User has some course progress. Redirecting to /lesson/${lastLessonId}`);
                  this.router.navigate(['lesson', lastLessonId], { relativeTo: this.route });
                } else {
                  const firstLessonId = course.lessons[0].id;
                  console.log(`LearnComponent: User has no course progress. Redirecting to /lesson/${firstLessonId}`);
                  this.router.navigate(['lesson', firstLessonId], { relativeTo: this.route, state: course.lessons[0] });
                }
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
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.courseSubscription.unsubscribe();
    this.relatedCoursesSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
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
}
