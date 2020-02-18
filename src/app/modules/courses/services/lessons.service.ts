import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

// TODO: Implement lesson type
@Injectable({
  providedIn: 'root'
})
export class LessonsService {
  host = environment.host;
  apiVersion = environment.apiVersion;

  constructor(private http: HttpClient) {}

  getLesson(lessonId: string): Observable<any> {
    console.log(`Lessons service: Getting lesson with id ${lessonId}`);
    const url = `${this.host}/${this.apiVersion}/lessons/${lessonId}`;
    return this.http.get<any>(url);
  }

}
