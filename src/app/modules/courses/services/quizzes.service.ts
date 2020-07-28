import { Injectable } from '@angular/core';
import { Quiz } from '../../../shared/models/quiz.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AttemptedQuiz } from '../../../shared/models/attempted-quiz.model';

@Injectable({
  providedIn: 'root'
})
export class QuizzesService {
  host = environment.host;
  apiVersion = environment.apiVersion;

  public nextCourseObjectSubject = new BehaviorSubject<boolean>(false);
  public nextCourseObject$ = this.nextCourseObjectSubject.asObservable();

  constructor(
    private http: HttpClient
  ) { }

  getQuiz(quizId: string): Observable<Quiz> {
    console.log(`Quizzes service: Getting quiz with id ${quizId}`);
    const url = `${this.host}/${this.apiVersion}/quizzes/${quizId}?populate=assesments`;
    return this.http.get<Quiz>(url);
  }

  getLatestUserAttemptedQuiz(userId: string, courseId: string, quizId: string): Observable<AttemptedQuiz> {
    console.log(`Quizzes service: Getting user latest attempted quiz`);
    const url = `${this.host}/${this.apiVersion}/users/me/subscribed-courses/${courseId}/quizzes/${quizId}/attepmted-quizzes/latest`;
    return this.http.get<AttemptedQuiz>(url);
  }

  userAttemptedQuiz(quiz: Quiz): Observable<AttemptedQuiz> {
    console.log(`Quizzes service: Creating user attempted quiz`);
    const url = `${this.host}/${this.apiVersion}/users/me/subscribed-courses/${quiz.course}/quizzes/${quiz.id}/user-attempted-quizzes`;
    return this.http.post<AttemptedQuiz>(url, {});
  }

  answerAssesment(quiz: Quiz, assesmentId: string, response: number): Observable<{ response: number, score: number, correctResponse: number, updateProgress: boolean }> {
    console.log(`Quizzes service: Getting user assesment result`);
    const url = `${this.host}/${this.apiVersion}/users/me/subscribed-courses/${quiz.course}/quizzes/${quiz.id}/assessment-answers`;
    return this.http.post<any>(url, {
      assesmentId,
      response
    });
  }

  getUserQuizResults(quiz: Quiz, attemptedQuiz: AttemptedQuiz): Observable<AttemptedQuiz> {
    console.log(`Quizzes service: Getting user latest attempted quiz results`);
    const url = `${this.host}/${this.apiVersion}/users/me/subscribed-courses/${quiz.course}/quizzes/${quiz.id}/user-attempted-quizzes/${attemptedQuiz.id}/stats/`;
    return this.http.get<AttemptedQuiz>(url);
  }
}
