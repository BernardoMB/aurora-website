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

  countries = [
    'Afghanistan',
    'AlandIslands',
    'Albania',
    'Algeria',
    'AmericanSamoa',
    'Andorra',
    'Angola',
    'Anguilla',
    'Antarctica',
    'AntiguaAndBarbuda',
    'Argentina',
    'Armenia',
    'Aruba',
    'Australia',
    'Austria',
    'Azerbaijan',
    'Bahamas',
    'Bahrain',
    'Bangladesh',
    'Barbados',
    'Belarus',
    'Belgium',
    'Belize',
    'Benin',
    'Bermuda',
    'Bhutan',
    'Bolivia',
    'BosniaAndHerzegovina',
    'Botswana',
    'BouvetIsland',
    'Brazil',
    'BritishIndianOceanTerritory',
    'BruneiDarussalam',
    'Bulgaria',
    'BurkinaFaso',
    'Burundi',
    'Cambodia',
    'Cameroon',
    'Canada',
    'CapeVerde',
    'CaymanIslands',
    'CentralAfricanRepublic',
    'Chad',
    'Chile',
    'China',
    'ChristmasIsland',
    'CocosKeelingIslands',
    'Colombia',
    'Comoros',
    'Congo',
    'CongoDemocraticRepublic',
    'CookIslands',
    'CostaRica',
    'CoteDIvoire',
    'Croatia',
    'Cuba',
    'Cyprus',
    'CzechRepublic',
    'Denmark',
    'Djibouti',
    'Dominica',
    'DominicanRepublic',
    'Ecuador',
    'Egypt',
    'ElSalvador',
    'EquatorialGuinea',
    'Eritrea',
    'Estonia',
    'Ethiopia',
    'FalklandIslands',
    'FaroeIslands',
    'Fiji',
    'Finland',
    'France',
    'FrenchGuiana',
    'FrenchPolynesia',
    'FrenchSouthernTerritories',
    'Gabon',
    'Gambia',
    'Georgia',
    'Germany',
    'Ghana',
    'Gibraltar',
    'Greece',
    'Greenland',
    'Grenada',
    'Guadeloupe',
    'Guam',
    'Guatemala',
    'Guernsey',
    'Guinea',
    'GuineaBissau',
    'Guyana',
    'Haiti',
    'HeardIslandMcdonaldIslands',
    'HolySeeVaticanCityState',
    'Honduras',
    'HongKong',
    'Hungary',
    'Iceland',
    'India',
    'Indonesia',
    'Iran',
    'Iraq',
    'Ireland',
    'IsleOfMan',
    'Israel',
    'Italy',
    'Jamaica',
    'Japan',
    'Jersey',
    'Jordan',
    'Kazakhstan',
    'Kenya',
    'Kiribati',
    'Korea',
    'Kuwait',
    'Kyrgyzstan',
    'LaoPeoplesDemocraticRepublic',
    'Latvia',
    'Lebanon',
    'Lesotho',
    'Liberia',
    'LibyanArabJamahiriya',
    'Liechtenstein',
    'Lithuania',
    'Luxembourg',
    'Macao',
    'Macedonia',
    'Madagascar',
    'Malawi',
    'Malaysia',
    'Maldives',
    'Mali',
    'Malta',
    'MarshallIslands',
    'Martinique',
    'Mauritania',
    'Mauritius',
    'Mayotte',
    'Mexico',
    'Micronesia',
    'Moldova',
    'Monaco',
    'Mongolia',
    'Montenegro',
    'Montserrat',
    'Morocco',
    'Mozambique',
    'Myanmar',
    'Namibia',
    'Nauru',
    'Nepal',
    'Netherlands',
    'NetherlandsAntilles',
    'NewCaledonia',
    'NewZealand',
    'Nicaragua',
    'Niger',
    'Nigeria',
    'Niue',
    'NorfolkIsland',
    'NorthernMarianaIslands',
    'Norway',
    'Oman',
    'Pakistan',
    'Palau',
    'PalestinianTerritory',
    'Panama',
    'PapuaNewGuinea',
    'Paraguay',
    'Peru',
    'Philippines',
    'Pitcairn',
    'Poland',
    'Portugal',
    'PuertoRico',
    'Qatar',
    'Reunion',
    'Romania',
    'RussianFederation',
    'Rwanda',
    'SaintBarthelemy',
    'SaintHelena',
    'SaintKittsAndNevis',
    'SaintLucia',
    'SaintMartin',
    'SaintPierreAndMiquelon',
    'SaintVincentAndGrenadines',
    'Samoa',
    'SanMarino',
    'SaoTomeAndPrincipe',
    'SaudiArabia',
    'Senegal',
    'Serbia',
    'Seychelles',
    'SierraLeone',
    'Singapore',
    'Slovakia',
    'Slovenia',
    'SolomonIslands',
    'Somalia',
    'SouthAfrica',
    'SouthGeorgiaAndSandwichIsl',
    'Spain',
    'SriLanka',
    'Sudan',
    'Suriname',
    'SvalbardAndJanMayen',
    'Swaziland',
    'Sweden',
    'Switzerland',
    'SyrianArabRepublic',
    'Taiwan',
    'Tajikistan',
    'Tanzania',
    'Thailand',
    'TimorLeste',
    'Togo',
    'Tokelau',
    'Tonga',
    'TrinidadAndTobago',
    'Tunisia',
    'Turkey',
    'Turkmenistan',
    'TurksAndCaicosIslands',
    'Tuvalu',
    'Uganda',
    'Ukraine',
    'UnitedArabEmirates',
    'UnitedKingdom',
    'UnitedStates',
    'UnitedStatesOutlyingIslands',
    'Uruguay',
    'Uzbekistan',
    'Vanuatu',
    'Venezuela',
    'VietNam',
    'VirginIslandsBritish',
    'VirginIslandsUS',
    'WallisAndFutuna',
    'WesternSahara',
    'Yemen',
    'Zambia',
    'Zimbabwe'
  ];

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

  /**
   *
   *
   * @param {Page} page
   * @returns {Observable<PagedData<Course>>}
   * @memberof CoursesService
   */
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

  /**
   *
   *
   * @param {Page} page
   * @returns {Observable<PagedData<Course>>}
   * @memberof CoursesService
   */
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

  /**
   *
   *
   * @param {Page} page
   * @returns {Observable<PagedData<Course>>}
   * @memberof CoursesService
   */
  getUserWishlistCoursesPagedData(page: Page): Observable<PagedData<Course>> {
    console.log(`Courses service: Getting user whishlist courses page`);
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

  /**
   *
   *
   * @param {Page} page
   * @returns {Observable<PagedData<Course>>}
   * @memberof CoursesService
   */
  getUserArchivedCoursesPagedData(page: Page): Observable<PagedData<Course>> {
    console.log(`Courses service: Getting user archived courses page`);
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

}
