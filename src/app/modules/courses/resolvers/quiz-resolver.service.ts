import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { Injectable } from '@angular/core';
import { LessonsService } from '../services/lessons.service';
import { QuizzesService } from '../services/quizzes.service';
import { map } from 'rxjs/operators';

@Injectable()
export class QuizResolver implements Resolve<any> {
  constructor(private quizzesService: QuizzesService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    const quizId = route.params.id;
    const quizCall = this.quizzesService.getQuiz(quizId);
    return forkJoin([quizCall]).pipe(
      map((allResponses) => {
        const quizInfo = {
          quiz: allResponses[0]
        };
        return quizInfo;
      })
    );
  }
}
