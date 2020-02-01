import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { log } from 'util';
import { Course } from 'src/app/shared/models/course.model';
import { Category } from 'src/app/shared/models/category.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  host = environment.host;
  apiVersion = environment.apiVersion;

  constructor(private http: HttpClient) {}

  getFeaturedCourses(
    skip: number, // for pagination
    limit: number // for pagination
  ): Observable<Array<Course>> {
    log('Coureses service: getting featured courses');
    const url = `${this.host}/${this.apiVersion}/courses/public?skip=${skip}&limit=${limit}`;
    return this.http.get<Array<Course>>(url);
  }

  getCategories(): Observable<Array<Category>> {
    log('Coureses service: getting categories');
    const url = `${this.host}/${this.apiVersion}/categories`;
    return this.http.get<Array<Category>>(url);
  }

  getCategory(categoryId: string): Observable<Category> {
    console.log(`Courses service: getting category with id ${categoryId}`);
    const url = `${this.host}/${this.apiVersion}/categories/${categoryId}`;
    return this.http.get<Category>(url);
  }

  getCategoryFeaturedCourses(categoryId: string): Observable<Array<Course>> {
    console.log(`Courses service: getting featured courses of category with id ${categoryId}`);
    const url = `${this.host}/${this.apiVersion}/courses/public?category=${categoryId}`;
    return this.http.get<Array<Course>>(url);
  }

  getCategoryCourses(categoryId: string): Observable<Array<Course>> {
    // TODO: This endpoint must never be called without pagination.
    // TODO: Incorporate pagination when calling this endpoint.
    console.log(`Courses service: getting featured courses of category with id ${categoryId}`);
    const url = `${this.host}/${this.apiVersion}/courses/public?category=${categoryId}`;
    return this.http.get<Array<Course>>(url);
  }

}
