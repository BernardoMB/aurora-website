import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { log } from 'util';
import { Course } from 'src/app/shared/models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  constructor(private http: HttpClient) {}

  getFeaturedCourses(
    skip: number, // for pagination
    limit: number // for pagination
  ): Observable<Array<Course>> {
    log('Coureses service: getting featured courses');
    const url = `http://localhost:3000/v1/courses/public?skip=${skip}&limit=${limit}`;
    return this.http.get<Array<Course>>(url);
  }

}
