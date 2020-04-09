import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from 'src/app/shared/models/course.model';
import { Category } from 'src/app/shared/models/category.model';
import { environment } from '../../../../environments/environment';
import { tap, map } from 'rxjs/operators';
import { Page, PagedData } from '../../../shared/utils';
import { Review } from '../../../shared/models/review.model';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  host = environment.host;
  apiVersion = environment.apiVersion;

  constructor(private http: HttpClient) {}

  /**
   * Get all categories. No pagination needed.
   *
   * @returns {Observable<Array<Category>>}
   * @memberof CoursesService
   */
  getCategories(): Observable<Array<Category>> {
    console.log('Coureses service: Getting categories');
    const url = `${this.host}/${this.apiVersion}/categories`;
    return this.http.get<Array<Category>>(url);
  }

  /**
   * Get a single category provind its id. No pagination needed.
   *
   * @param {string} categoryId
   * @returns {Observable<Category>}
   * @memberof CoursesService
   */
  getCategory(categoryId: string): Observable<Category> {
    console.log(`Courses service: Getting category`);
    const url = `${this.host}/${this.apiVersion}/categories/${categoryId}`;
    return this.http.get<Category>(url);
  }

  /**
   * Get a course by id. No pagination required
   *
   * @param {string} courseId
   * @returns {Observable<Course>}
   * @memberof CoursesService
   */
  getCourse(courseId: string): Observable<Course> {
    console.log(`Courses service: Getting course with id ${courseId}`);
    const url = `${this.host}/${this.apiVersion}/courses/${courseId}?populate=category,lessons,reviews`;
    return this.http.get<Course>(url);
  }

  /**
   * Get courses by ids. No pagination required
   *
   * @param {string[]} courseIds
   * @returns {Observable<Course[]>}
   * @memberof CoursesService
   */
  getCourses(courseIds: string[]): Observable<Course[]> {
    console.log('Courses service: Getting courses providing array of ids');
    const url = `${this.host}/${this.apiVersion}/courses/getByIds`;
    return this.http.post<Course[]>(url, {courseIds});
  }

  /**
   * Get courses page.
   *
   * @param {Page} page
   * @returns {Observable<PagedData<Course>>}
   * @memberof CoursesService
   */
  getCoursesPageData(page: Page): Observable<PagedData<Course>> {
    console.log('Coureses service: Getting courses page');
    const skip = page.size * (page.pageNumber - 1);
    const limit = page.size;
    const url = `${this.host}/${this.apiVersion}/courses/public?skip=${skip}&limit=${limit}&populate=category&sort=+createdAt`;
    return this.http.get<{ count: number, data: Course[]}>(url).pipe(
      map(responseBody => {
        // console.log('Got data', responseBody);
        const pagedData = new PagedData<Course>();
        page.totalElements = responseBody.count;
        page.totalPages = Math.ceil(page.totalElements / page.size);
        pagedData.data = responseBody.data;
        pagedData.page = page;
        // console.log(pagedData);
        return pagedData;
      })
    );
  }

  /**
   * Get featured courses page.
   *
   * @param {Page} page
   * @returns {Observable<PagedData<Course>>}
   * @memberof CoursesService
   */
  getFeaturedCoursesPageData(page: Page): Observable<PagedData<Course>> {
    console.log('Coureses service: Getting featured courses page');
    const skip = page.size * (page.pageNumber - 1);
    const limit = page.size;
    const url = `${this.host}/${this.apiVersion}/courses/public?skip=${skip}&limit=${limit}&populate=category&sort=+createdAt&featured=true`;
    return this.http.get<{ count: number, data: Course[]}>(url).pipe(
      map(responseBody => {
        // console.log('Got data', responseBody);
        const pagedData = new PagedData<Course>();
        page.totalElements = responseBody.count;
        page.totalPages = Math.ceil(page.totalElements / page.size);
        pagedData.data = responseBody.data;
        pagedData.page = page;
        // console.log(pagedData);
        return pagedData;
      })
    );
  }

  /**
   * Get trending courses page.
   *
   * @param {Page} page
   * @returns {Observable<PagedData<Course>>}
   * @memberof CoursesService
   */
  getTrendingCoursesPageData(page: Page): Observable<PagedData<Course>> {
    console.log('Coureses service: Getting featured courses page');
    const skip = page.size * (page.pageNumber - 1);
    const limit = page.size;
    const url = `${this.host}/${this.apiVersion}/courses/public?skip=${skip}&limit=${limit}&populate=category&sort=+createdAt&featured=true`;
    return this.http.get<{ count: number, data: Course[]}>(url).pipe(
      map(responseBody => {
        // console.log('Got data', responseBody);
        const pagedData = new PagedData<Course>();
        page.totalElements = responseBody.count;
        page.totalPages = Math.ceil(page.totalElements / page.size);
        pagedData.data = responseBody.data;
        pagedData.page = page;
        // console.log(pagedData);
        return pagedData;
      })
    );
  }

  /**
   *
   *
   * @param {Page} page
   * @param {string} categoryId
   * @returns {Observable<PagedData<Course>>}
   * @memberof CoursesService
   */
  getCategoryCoursesPageData(page: Page, categoryId: string): Observable<PagedData<Course>> {
    console.log(`Courses service: Getting category courses page`);
    const skip = page.size * (page.pageNumber - 1);
    const limit = page.size;
    const url = `${this.host}/${this.apiVersion}/courses/public?skip=${skip}&limit=${limit}&populate=category&sort=+createdAt&category=${categoryId}`;
    return this.http.get<{ count: number, data: Course[]}>(url).pipe(
      map(responseBody => {
        const pagedData = new PagedData<Course>();
        page.totalElements = responseBody.count;
        page.totalPages = Math.ceil(page.totalElements / page.size);
        pagedData.data = responseBody.data;
        pagedData.page = page;
        return pagedData;
      })
    );
  }

  /**
   * Get category featured courses page.
   *
   * @param {string} categoryId
   * @returns {Observable<Array<Course>>}
   * @memberof CoursesService
   */
  getCategoryFeaturedCoursesPageData(page: Page, categoryId: string): Observable<PagedData<Course>> {
    console.log(`Courses service: Getting category featured courses page`);
    const skip = page.size * (page.pageNumber - 1);
    const limit = page.size;
    const url = `${this.host}/${this.apiVersion}/courses/public?skip=${skip}&limit=${limit}&populate=category&sort=+createdAt&featured=true&category=${categoryId}`;
    return this.http.get<{ count: number, data: Course[]}>(url).pipe(
      map(responseBody => {
        const pagedData = new PagedData<Course>();
        page.totalElements = responseBody.count;
        page.totalPages = Math.ceil(page.totalElements / page.size);
        pagedData.data = responseBody.data;
        pagedData.page = page;
        return pagedData;
      })
    );
  }

  /**
   * No pagination needed
   *
   * @param {string} userId
   * @returns
   * @memberof CoursesService
   */
  getRecommendedCourses(userId: string) {
    console.log(`Courses service: Getting recommended courses`);
    const url = `${this.host}/${this.apiVersion}/users/me/recommendedCourses`;
    return this.http.get<Course[]>(url);
  }

  /**
   *
   *
   * @param {string} courseId
   * @param {number} rating
   * @param {string} review
   * @returns {Observable<Review>}
   * @memberof CoursesService
   */
  reviewCourse(courseId: string, rating: number, review: string): Observable<Review> {
    console.log('Courses service: Creating course review');
    const url = `${this.host}/${this.apiVersion}/courses/${courseId}/review`;
    const body = { review, rating };
    return this.http.post<Review>(url, body);
  }

  /**
   * This service call is used for reviews infinte scroll functionality.
   *
   * @param {string} courseId
   * @param {number} skip
   * @param {number} limit
   * @returns {Observable<any[]>}
   * @memberof CoursesService
   */
  getCourseReviews(courseId: string, skip: number, limit: number): Observable<Review[]> {
    console.log(`Courses service: Getting course reviews skiping ${skip} elements and limiting to ${limit} elements`);
    const url = `${this.host}/${this.apiVersion}/reviews?course=${courseId}&skip=${skip}&limit=${limit}&populate=user`;
    return this.http.get<Review[]>(url);
  }




  getUserCoursesPagedData(page: Page): Observable<PagedData<Course>> {
    console.log(`Courses service: Getting user courses page`);
    const skip = page.size * (page.pageNumber - 1);
    const limit = page.size;
    const url = `${this.host}/${this.apiVersion}/users/me/courses?skip=${skip}&limit=${limit}`;
    return this.http.get<{ count: number, data: Course[]}>(url).pipe(
      map(responseBody => {
        const pagedData = new PagedData<Course>();
        page.totalElements = responseBody.count;
        page.totalPages = Math.ceil(page.totalElements / page.size);
        pagedData.data = responseBody.data;
        pagedData.page = page;
        return pagedData;
      })
    );
  }

  getUserFavoriteCoursesPagedData(page: Page): Observable<PagedData<Course>> {
    console.log(`Courses service: Getting user favorite courses page`);
    const skip = page.size * (page.pageNumber - 1);
    const limit = page.size;
    const url = `${this.host}/${this.apiVersion}/users/me/courses?skip=${skip}&limit=${limit}&list=favoriteCourses`;
    return this.http.get<{ count: number, data: Course[]}>(url).pipe(
      map(responseBody => {
        const pagedData = new PagedData<Course>();
        page.totalElements = responseBody.count;
        page.totalPages = Math.ceil(page.totalElements / page.size);
        pagedData.data = responseBody.data;
        pagedData.page = page;
        return pagedData;
      })
    );
  }

  getUserWishlistCoursesPagedData(page: Page): Observable<PagedData<Course>> {
    console.log(`Courses service: Getting user favorite courses page`);
    const skip = page.size * (page.pageNumber - 1);
    const limit = page.size;
    const url = `${this.host}/${this.apiVersion}/users/me/courses?skip=${skip}&limit=${limit}&list=wishList`;
    return this.http.get<{ count: number, data: Course[]}>(url).pipe(
      map(responseBody => {
        const pagedData = new PagedData<Course>();
        page.totalElements = responseBody.count;
        page.totalPages = Math.ceil(page.totalElements / page.size);
        pagedData.data = responseBody.data;
        pagedData.page = page;
        return pagedData;
      })
    );
  }

  getUserArchivedCoursesPagedData(page: Page): Observable<PagedData<Course>> {
    console.log(`Courses service: Getting user favorite courses page`);
    const skip = page.size * (page.pageNumber - 1);
    const limit = page.size;
    const url = `${this.host}/${this.apiVersion}/users/me/courses?skip=${skip}&limit=${limit}&list=archivedCourses`;
    return this.http.get<{ count: number, data: Course[]}>(url).pipe(
      map(responseBody => {
        const pagedData = new PagedData<Course>();
        page.totalElements = responseBody.count;
        page.totalPages = Math.ceil(page.totalElements / page.size);
        pagedData.data = responseBody.data;
        pagedData.page = page;
        return pagedData;
      })
    );
  }

















  // * User courses

  // TODO: Requires pagination
    getUserCourses(skip: number, limit: number): Observable<Course[]> {
      console.log('Courses service: Getting user courses with pagination');
      const url = `${this.host}/${this.apiVersion}/users/me/courses?skip=${skip}&limit=${limit}`;
      return this.http.get<Course[]>(url);
    }

  // TODO: Requires pagination
  getUserFavoriteCourses(skip: number, limit: number): Observable<Course[]> {
    console.log('Courses service: Getting user favorite courses with pagination');
    const url = `${this.host}/${this.apiVersion}/users/me/courses?skip=${skip}&limit=${limit}&list=favoriteCourses`;
    return this.http.get<Course[]>(url);
  }

  // TODO: Requires pagination
  getUserWishlistCourses(skip: number, limit: number): Observable<Course[]> {
    console.log('Courses service: Getting user wishlist courses with pagination');
    const url = `${this.host}/${this.apiVersion}/users/me/courses?skip=${skip}&limit=${limit}&list=wishList`;
    return this.http.get<Course[]>(url);
  }

  // TODO: Requires pagination
  getUserArchivedCourses(skip: number, limit: number): Observable<Course[]> {
    console.log('Courses service: Getting user archived courses with pagination');
    const url = `${this.host}/${this.apiVersion}/users/me/courses?skip=${skip}&limit=${limit}&list=archivedCourses`;
    return this.http.get<Course[]>(url);
  }

}
