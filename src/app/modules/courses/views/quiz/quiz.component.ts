import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { State } from '../../../../store/state';
import { Subscription } from 'rxjs';
import { selectAuthUser } from '../../../../store/auth/auth.selectors';
import { User } from '../../../../shared/models/user.model';
import { QuizzesService } from '../../services/quizzes.service';
import { Quiz } from '../../../../shared/models/quiz.model';
import { AttemptedQuiz } from '../../../../shared/models/attempted-quiz.model';
import { Assesment } from '../../../../shared/models/assesment.model';
import { catchError } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { addQuizToProgress } from '../../../../store/auth/auth.actions';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {
  user;
  userSubscription: Subscription;
  quiz: Quiz;
  showStartQuiz = false;
  showAssesmentView = false;
  showStatsView = false;
  showSkipAssesmentButton = false;
  showCheckAnswerButton = true;
  assesmentsIds = [];
  currentAssesment: Assesment;
  radioGroupControl = new FormControl();
  checkAnswerButtonDisabled = true;
  showCorrectIndicator = false;
  showIncorrectIndicator = false;
  showNextButton = false;
  showSeeResultsButton = false;
  currentAttemptedQuiz: AttemptedQuiz;
  // Stats
  totalCorrect: number;
  totalReview: number;
  correct = [];
  review = [];
  skipped = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<State>,
    private quizzesService: QuizzesService
  ) {
    this.route.data.subscribe((data) => {
      // console.log('%cActivatedRoute data:', 'color: red', data);
      if (data.quizInfo) {
        if (data.quizInfo.quiz) {
          this.quiz = data.quizInfo.quiz;
          this.assesmentsIds = this.quiz.assesments.map((assesment) => assesment.id);
        }
      }
    });
  }

  ngOnInit(): void {
    this.userSubscription = this.store.pipe(select(selectAuthUser)).subscribe((user: User) => {
      if (user) {
        this.user = user;
        this.quizzesService.getLatestUserAttemptedQuiz(
          user.id,
          this.quiz.course,
          this.quiz.id
        ).pipe(
          catchError((error) => {
            // console.log('QuizComponent: User has not attempted this course');
            this.userSubscription.unsubscribe();
            this.showStartQuiz = true;
            throw error;
          })
        ).subscribe((attemptedQuiz: AttemptedQuiz) => {
          if (attemptedQuiz) {
            // console.log('QuizComponent: User latest attempted quiz', attemptedQuiz);
            this.currentAttemptedQuiz = attemptedQuiz;
            if (attemptedQuiz.completedAssesments.length === this.quiz.assesments.length) {
              // All assesments where completed
              // console.log('All assesments where completed. Showing stats view');
              this.handleStats(attemptedQuiz);
            } else {
              // There are incompleted assesments. Determine which incomplete assesment to display.
              // tslint:disable-next-line: prefer-for-of
              for (let i = 0; i < this.quiz.assesments.length; i++) {
                // console.log('Checando si assesment ya fue completado');
                if (attemptedQuiz.completedAssesments.indexOf(this.quiz.assesments[i].id) === -1) {
                  // console.log('El assesment no ha sido completado');
                  if (i === 0) {
                    // console.log('El assesment no fue completado y es el primero');
                    this.showStartQuiz = true;
                    break;
                  } else {
                    this.currentAssesment = this.quiz.assesments[i];
                    this.showStartQuiz = false;
                    this.showStatsView = false;
                    this.showAssesmentView = true;
                    this.showSkipAssesmentButton = true;
                    this.checkAnswerButtonDisabled = true;
                    this.showCheckAnswerButton = true;
                    break;
                  }
                }
              }
            }
          } else  {
            // console.log('QuizComponent: User has not attempted this course');
            this.showStartQuiz = true;
          }
          this.userSubscription.unsubscribe();
        });
      }
    });

    this.radioGroupControl.valueChanges.subscribe((value) => {
      if (typeof value === 'number') {
        this.checkAnswerButtonDisabled = false;
      } else {
        this.checkAnswerButtonDisabled = true;
      }
    });
  }

  onStartQuiz() {
    if (this.quiz.assesments.length > 0) {
      this.currentAssesment = this.quiz.assesments[0];
      this.showStartQuiz = false;
      this.showAssesmentView = true;
      this.showSkipAssesmentButton = true;
      this.correct = [];
      this.review = [];
      this.skipped = [];
      this.quizzesService.userAttemptedQuiz(this.quiz).subscribe((attemptedQuiz: AttemptedQuiz) => {
        if (attemptedQuiz) {
          // console.log('QuizComponent: Created attempted quiz', attemptedQuiz);
          this.currentAttemptedQuiz = attemptedQuiz;
        }
      });
    }
  }

  onSkipAssesment() {
    if (this.assesmentsIds.indexOf(this.currentAssesment.id) !== this.assesmentsIds.length - 1) {
      // User skiped assesment
      this.skipped.push(this.currentAssesment);
      this.showStatsView = false;
      this.currentAssesment = this.quiz.assesments[this.assesmentsIds.indexOf(this.currentAssesment.id) + 1];
    } else {
      // User skiped the last assesment
      this.skipped.push(this.currentAssesment);
      this.quizzesService.getUserQuizResults(this.quiz, this.currentAttemptedQuiz).subscribe((attemptedQuiz: AttemptedQuiz) => {
        // console.log('User skipped the last assesment. Displaying stats view');
        this.handleStats(attemptedQuiz);
      });
      this.showAssesmentView = false;
      this.showStatsView = true;
    }
  }

  onCheckAnswer() {
    const assestmentId = this.currentAssesment.id;
    const response = this.radioGroupControl.value;
    this.quizzesService.answerAssesment(this.quiz, assestmentId, response).subscribe((assesmentResult) => {
      if (assesmentResult.updateProgress) {
        this.store.dispatch(addQuizToProgress({ courseId: this.quiz.course, quizId: this.quiz.id }));
      }
      if (assesmentResult.score > 0) {
        this.radioGroupControl.disable();
        this.showCorrectIndicator = true;
        this.showIncorrectIndicator = false;
        this.checkAnswerButtonDisabled = true;
        this.showSkipAssesmentButton = false;
        if (this.assesmentsIds.indexOf(assestmentId) === this.assesmentsIds.length - 1) {
          this.showSeeResultsButton = true;
        } else {
          this.showNextButton = true;
        }
      } else {
        this.showCorrectIndicator = false;
        this.showIncorrectIndicator = true;
      }
    });
  }

  onNextAssesment() {
    this.showCorrectIndicator = false;
    this.showIncorrectIndicator = false;
    this.checkAnswerButtonDisabled = true;
    this.showSkipAssesmentButton = true;
    this.showNextButton = false;
    this.radioGroupControl.setValue(undefined);
    this.radioGroupControl.enable();
    this.currentAssesment = this.quiz.assesments[this.assesmentsIds.indexOf(this.currentAssesment.id) + 1];
  }

  onViewResults() {
    this.quizzesService.getUserQuizResults(this.quiz, this.currentAttemptedQuiz).subscribe((attemptedQuiz: AttemptedQuiz) => {
      // console.log('User resquested results. Displaying stats view');
      this.handleStats(attemptedQuiz);
    });
  }

  handleStats(attemptedQuiz: AttemptedQuiz) {
    console.log(attemptedQuiz);
    if (attemptedQuiz) {
      this.totalCorrect = 0;
      this.totalReview = 0;
      this.quiz.assesments.forEach((assesment: Assesment) => {
        if (attemptedQuiz.correct.indexOf(assesment.id) !== -1) {
          this.correct.push(assesment);
          this.totalCorrect++;
        } else if (attemptedQuiz.wrong.indexOf(assesment.id) !== -1) {
          this.review.push(assesment);
          this.totalReview++;
        } else {
          if (this.skipped.indexOf(assesment) === -1) {
            this.skipped.push(assesment);
          }
          this.totalReview++;
        }
      });
      this.showStartQuiz = false;
      this.showAssesmentView = false;
      this.showStatsView = true;
    }
  }

  onRetryQuiz() {
    this.showStartQuiz = true;
    this.showStatsView = false;
    this.showAssesmentView = false;
    this.showCorrectIndicator = false;
    this.showIncorrectIndicator = false;
    this.showSeeResultsButton = false;
    this.radioGroupControl.enable();
    this.radioGroupControl.setValue(undefined);
    this.correct = [];
    this.review = [];
    this.skipped = [];
    this.totalCorrect = 0;
    this.totalReview = 0;
  }

  onContinue() {
    this.quizzesService.nextCourseObjectSubject.next(true);
    this.radioGroupControl.enable();
    this.radioGroupControl.setValue(undefined);
    this.correct = [];
    this.review = [];
    this.skipped = [];
    this.totalCorrect = 0;
    this.totalReview = 0;
  }

}
