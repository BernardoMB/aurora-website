import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { State } from '../../../../store/state';
import { selectAuthUser } from '../../../../store/auth/auth.selectors';
import { Subscription } from 'rxjs';
import { User } from '../../../../shared/models/user.model';
import { Course } from '../../../../shared/models/course.model';
import { ActivatedRoute, UrlSegment, Router, NavigationEnd, Event } from '@angular/router';
import { completeLesson } from '../../../../store/auth/auth.actions';
import { filter } from 'rxjs/operators';
import * as html2canvas from 'html2canvas';

@Component({
  selector: 'app-learn',
  templateUrl: './learn.component.html',
  styleUrls: ['./learn.component.scss'],
})
export class LearnComponent implements OnInit, OnDestroy {
  @ViewChild('content', { static: true }) private contentElement: ElementRef;
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

  constructor(
    private store: Store<State>,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.data.subscribe((data: { learningInfo: { course: Course, userProgress: string[], relatedCourses: Course[] } }) => {
      if (data.learningInfo) {
        this.course = data.learningInfo.course;
        // TODO: Implement lesson types
        this.lessonIds = (data.learningInfo.course.lessons as any[]).map(lesson => lesson.id);
        this.userProgress = data.learningInfo.userProgress;
        this.relatedCourses = data.learningInfo.relatedCourses;
      }
    });

    this.routerSubscription = this.router.events.pipe(
      filter((event: Event) => {
        return event instanceof NavigationEnd;
      })
    ).subscribe((event: NavigationEnd) => {
      if (this.route.firstChild) {
        this.urlSubscription = this.route.firstChild.url.subscribe((childUrl: UrlSegment[]) => {
          if (childUrl && childUrl[1] && this.lessonIds.length > 0) {
            const lessonId = childUrl[1].path;
            this.currentLessonId = lessonId;
            const index = this.lessonIds.indexOf(lessonId);
            index === 0 ? this.showPrevButton = false : this.showPrevButton = true;
            index === this.lessonIds.length - 1 ? this.showNextButton = false : this.showNextButton = true;
            if (this.lessonIds.indexOf(lessonId) === this.lessonIds.length - 1 && this.userProgress.indexOf(lessonId) === -1) {
              this.store.dispatch(completeLesson({ courseId: this.course.id, lessonId }));
            }
          }
        });
      } else {
        const lessonId = this.lessonIds[0];
        console.log(`LearnComponent: No route first child url. Redirecting to /lesson/${lessonId}`);
        this.router.navigate(['lesson', lessonId], { relativeTo: this.route });
      }
    });
  }

  ngOnInit() {
    this.userSubscription = this.store.pipe(select(selectAuthUser)).subscribe((user: User) => {
      if (user) {
        this.user = user;
        this.userProgress = this.user.purchasedCourses
          .filter(purchasedcourse => purchasedcourse.course === this.course.id)
          .map(purchasedcourse => purchasedcourse.progress)[0];
        if (this.userProgress.length === this.course.lessons.length) {
          this.showCertificate = true;
        }
      }
    });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
    this.routerSubscription.unsubscribe();
    this.urlSubscription.unsubscribe();
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
    this.router.navigate(['lesson/', lessonId], { relativeTo: this.route });
  }

}
