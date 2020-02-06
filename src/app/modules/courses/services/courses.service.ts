import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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

  getFeaturedCourses(skip: number, limit: number): Observable<Array<Course>> {
    console.log('Coureses service: Getting featured courses');
    const url = `${this.host}/${this.apiVersion}/courses/public?skip=${skip}&limit=${limit}&populate=category`;
    return this.http.get<Array<Course>>(url);
  }

  getRecentCourses(skip: number, limit: number): Observable<Array<Course>> {
    console.log('Coureses service: Getting recent courses');
    let url: string;
    if (skip && limit) {
      url = `${this.host}/${this.apiVersion}/courses/public?skip=${skip}&limit=${limit}&populate=category&sort=-createdAt`;
    } else {
      url = `${this.host}/${this.apiVersion}/courses/public?populate=category&sort=-createdAt`;
    }
    return this.http.get<Array<Course>>(url);
  }

  getCategories(): Observable<Array<Category>> {
    console.log('Coureses service: Getting categories');
    const url = `${this.host}/${this.apiVersion}/categories`;
    return this.http.get<Array<Category>>(url);
  }

  getCategory(categoryId: string): Observable<Category> {
    console.log(`Courses service: Getting category with id ${categoryId}`);
    const url = `${this.host}/${this.apiVersion}/categories/${categoryId}`;
    return this.http.get<Category>(url);
  }

  getCategoryFeaturedCourses(categoryId: string): Observable<Array<Course>> {
    console.log(`Courses service: Getting featured courses of category with id ${categoryId}`);
    const url = `${this.host}/${this.apiVersion}/courses/public?category=${categoryId}`;
    return this.http.get<Array<Course>>(url);
  }

  getCategoryCourses(categoryId: string): Observable<Array<Course>> {
    // TODO: This endpoint must never be called without pagination.
    console.log(`Courses service: Getting featured courses of category with id ${categoryId}`);
    const url = `${this.host}/${this.apiVersion}/courses/public?category=${categoryId}`;
    return this.http.get<Array<Course>>(url);
  }

  getCourse(courseId: string): Observable<Course> {
    console.log(`Courses service: Getting course with id ${courseId}`);
    const url = `${this.host}/${this.apiVersion}/courses/${courseId}?populate=category`;
    return this.http.get<Course>(url);
  }

  getCoursesFromIds(courseIds: string[]): Observable<Course[]> {
    console.log('Courses service: Getting courses providing array of ids');
    const url = `${this.host}/${this.apiVersion}/courses/courses`;
    return this.http.post<Course[]>(url, {courseIds});
  }

}
