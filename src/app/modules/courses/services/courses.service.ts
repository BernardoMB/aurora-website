import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from 'src/app/shared/models/course.model';
import { Category } from 'src/app/shared/models/category.model';
import { environment } from '../../../../environments/environment';
import { tap, map } from 'rxjs/operators';
import { Page, PagedData } from '../../../shared/utils';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  host = environment.host;
  apiVersion = environment.apiVersion;

  constructor(private http: HttpClient) {}

  getPageData(page: Page): Observable<PagedData<Course>> {
    console.log('Coureses service: Getting courses page', page);
    const skip = page.size * (page.pageNumber - 1);
    const limit = page.size;
    const url = `${this.host}/${this.apiVersion}/courses/public?skip=${skip}&limit=${limit}&populate=category&sort=-createdAt`;
    return this.http.get<{ count: number, data: Course[]}>(url).pipe(
      map(responseBody => {
        const pagedData = new PagedData<Course>();
        page.totalElements = responseBody.count;
        page.totalPages = Math.ceil(page.totalElements / page.size);
        pagedData.data = responseBody.data;
        pagedData.page = page;
        console.log(pagedData);
        return pagedData;
      })
    );
  }

  getFeaturedCoursesPageData(page: Page): Observable<PagedData<Course>> {
    console.log('Coureses service: Getting featured courses page', page);
    const skip = page.size * (page.pageNumber - 1);
    const limit = page.size;
    const url = `${this.host}/${this.apiVersion}/courses/public?skip=${skip}&limit=${limit}&populate=category&sort=-createdAt&featured=true`;
    return this.http.get<{ count: number, data: Course[]}>(url).pipe(
      map(responseBody => {
        console.log('Got data', responseBody);
        const pagedData = new PagedData<Course>();
        page.totalElements = responseBody.count;
        page.totalPages = Math.ceil(page.totalElements / page.size);
        pagedData.data = responseBody.data;
        pagedData.page = page;
        console.log(pagedData);
        return pagedData;
      })
    );
  }

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
    // TODO: Add the featured filter
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
    const url = `${this.host}/${this.apiVersion}/courses/${courseId}?populate=category,lessons,reviews`;
    return this.http.get<Course>(url);
  }

  getCourses(courseIds: string[]): Observable<Course[]> {
    console.log('Courses service: Getting courses providing array of ids');
    const url = `${this.host}/${this.apiVersion}/courses/courses`;
    return this.http.post<Course[]>(url, {courseIds});
  }

  getUserCourses(skip: number, limit: number): Observable<Course[]> {
    console.log('Courses service: Getting user courses with pagination');
    const url = `${this.host}/${this.apiVersion}/users/me/courses?skip=${skip}&limit=${limit}`;
    return this.http.get<Course[]>(url);
  }

  getUserFavoriteCourses(skip: number, limit: number): Observable<Course[]> {
    console.log('Courses service: Getting user favorite courses with pagination');
    const url = `${this.host}/${this.apiVersion}/users/me/courses?skip=${skip}&limit=${limit}&list=favoriteCourses`;
    return this.http.get<Course[]>(url);
  }

  getUserWishlistCourses(skip: number, limit: number): Observable<Course[]> {
    console.log('Courses service: Getting user wishlist courses with pagination');
    const url = `${this.host}/${this.apiVersion}/users/me/courses?skip=${skip}&limit=${limit}&list=wishList`;
    return this.http.get<Course[]>(url);
  }

  getUserArchivedCourses(skip: number, limit: number): Observable<Course[]> {
    console.log('Courses service: Getting user archived courses with pagination');
    const url = `${this.host}/${this.apiVersion}/users/me/courses?skip=${skip}&limit=${limit}&list=archivedCourses`;
    return this.http.get<Course[]>(url);
  }

  // TODO: Implement review type
  reviewCourse(courseId: string, rating: number, review: string): Observable<any> {
    console.log('Courses service: Creating course review');
    const url = `${this.host}/${this.apiVersion}/courses/${courseId}/review`;
    const body = { review, rating };
    return this.http.post<any>(url, body);
  }

  getCourseReviews(courseId: string, skip: number, limit: number): Observable<any[]> {
    console.log(`Courses service: Getting course reviews skiping ${skip} elements and limiting to ${limit} elements`);
    const url = `${this.host}/${this.apiVersion}/reviews?course=${courseId}&skip=${skip}&limit=${limit}&populate=user`;
    return this.http.get<any>(url).pipe(
      tap((arr) => {
        console.log(`Courses service: Got ${arr.length} elements`);
      })
    );
  }

}
