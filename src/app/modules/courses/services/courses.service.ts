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
  countries = [{countryName: 'Afghanistan', countryCode: 'AF'}, {countryName: 'Albania', countryCode: 'AL'}, {countryName: 'Algeria', countryCode: 'DZ'}, {countryName: 'American Samoa', countryCode: 'AS'}, {countryName: 'Andorra', countryCode: 'AD'}, {countryName: 'Angola', countryCode: 'AO'}, {countryName: 'Anguilla', countryCode: 'AI'}, {countryName: 'Antarctica', countryCode: 'AQ'}, {countryName: 'Antigua and Barbuda', countryCode: 'AG'}, {countryName: 'Argentina', countryCode: 'AR'}, {countryName: 'Armenia', countryCode: 'AM'}, {countryName: 'Aruba', countryCode: 'AW'}, {countryName: 'Australia', countryCode: 'AU'}, {countryName: 'Austria', countryCode: 'AT'}, {countryName: 'Azerbaijan', countryCode: 'AZ'}, {countryName: 'Bahamas', countryCode: 'BS'}, {countryName: 'Bahrain', countryCode: 'BH'}, {countryName: 'Bangladesh', countryCode: 'BD'}, {countryName: 'Barbados', countryCode: 'BB'}, {countryName: 'Belarus', countryCode: 'BY'}, {countryName: 'Belgium', countryCode: 'BE'}, {countryName: 'Belize', countryCode: 'BZ'}, {countryName: 'Benin', countryCode: 'BJ'}, {countryName: 'Bermuda', countryCode: 'BM'}, {countryName: 'Bhutan', countryCode: 'BT'}, {countryName: 'Bolivia', countryCode: 'BO'}, {countryName: 'Bosnia and Herzegovina', countryCode: 'BA'}, {countryName: 'Botswana', countryCode: 'BW'}, {countryName: 'Bouvet Island', countryCode: 'BV'}, {countryName: 'Brazil', countryCode: 'BR'}, {countryName: 'British Indian Ocean Territory', countryCode: 'IO'}, {countryName: 'Brunei Darussalam', countryCode: 'BN'}, {countryName: 'Bulgaria', countryCode: 'BG'}, {countryName: 'Burkina Faso', countryCode: 'BF'}, {countryName: 'Burundi', countryCode: 'BI'}, {countryName: 'Cambodia', countryCode: 'KH'}, {countryName: 'Cameroon', countryCode: 'CM'}, {countryName: 'Canada', countryCode: 'CA'}, {countryName: 'Cape Verde', countryCode: 'CV'}, {countryName: 'Cayman Islands', countryCode: 'KY'}, {countryName: 'Central African Republic', countryCode: 'CF'}, {countryName: 'Chad', countryCode: 'TD'}, {countryName: 'Chile', countryCode: 'CL'}, {countryName: 'China', countryCode: 'CN'}, {countryName: 'Christmas Island', countryCode: 'CX'}, {countryName: 'Cocos (Keeling) Islands', countryCode: 'CC'}, {countryName: 'Colombia', countryCode: 'CO'}, {countryName: 'Comoros', countryCode: 'KM'}, {countryName: 'Congo', countryCode: 'CG'}, {countryName: 'Congo, the Democratic Republic of the', countryCode: 'CD'}, {countryName: 'Cook Islands', countryCode: 'CK'}, {countryName: 'Costa Rica', countryCode: 'CR'}, {countryName: 'Cote D\'Ivoire', countryCode: 'CI'}, {countryName: 'Croatia', countryCode: 'HR'}, {countryName: 'Cuba', countryCode: 'CU'}, {countryName: 'Cyprus', countryCode: 'CY'}, {countryName: 'Czech Republic', countryCode: 'CZ'}, {countryName: 'Denmark', countryCode: 'DK'}, {countryName: 'Djibouti', countryCode: 'DJ'}, {countryName: 'Dominica', countryCode: 'DM'}, {countryName: 'Dominican Republic', countryCode: 'DO'}, {countryName: 'Ecuador', countryCode: 'EC'}, {countryName: 'Egypt', countryCode: 'EG'}, {countryName: 'El Salvador', countryCode: 'SV'}, {countryName: 'Equatorial Guinea', countryCode: 'GQ'}, {countryName: 'Eritrea', countryCode: 'ER'}, {countryName: 'Estonia', countryCode: 'EE'}, {countryName: 'Ethiopia', countryCode: 'ET'}, {countryName: 'Falkland Islands (Malvinas)', countryCode: 'FK'}, {countryName: 'Faroe Islands', countryCode: 'FO'}, {countryName: 'Fiji', countryCode: 'FJ'}, {countryName: 'Finland', countryCode: 'FI'}, {countryName: 'France', countryCode: 'FR'}, {countryName: 'French Guiana', countryCode: 'GF'}, {countryName: 'French Polynesia', countryCode: 'PF'}, {countryName: 'French Southern Territories', countryCode: 'TF'}, {countryName: 'Gabon', countryCode: 'GA'}, {countryName: 'Gambia', countryCode: 'GM'}, {countryName: 'Georgia', countryCode: 'GE'}, {countryName: 'Germany', countryCode: 'DE'}, {countryName: 'Ghana', countryCode: 'GH'}, {countryName: 'Gibraltar', countryCode: 'GI'}, {countryName: 'Greece', countryCode: 'GR'}, {countryName: 'Greenland', countryCode: 'GL'}, {countryName: 'Grenada', countryCode: 'GD'}, {countryName: 'Guadeloupe', countryCode: 'GP'}, {countryName: 'Guam', countryCode: 'GU'}, {countryName: 'Guatemala', countryCode: 'GT'}, {countryName: 'Guinea', countryCode: 'GN'}, {countryName: 'Guinea-Bissau', countryCode: 'GW'}, {countryName: 'Guyana', countryCode: 'GY'}, {countryName: 'Haiti', countryCode: 'HT'}, {countryName: 'Heard Island and Mcdonald Islands', countryCode: 'HM'}, {countryName: 'Holy See (Vatican City State)', countryCode: 'VA'}, {countryName: 'Honduras', countryCode: 'HN'}, {countryName: 'Hong Kong', countryCode: 'HK'}, {countryName: 'Hungary', countryCode: 'HU'}, {countryName: 'Iceland', countryCode: 'IS'}, {countryName: 'India', countryCode: 'IN'}, {countryName: 'Indonesia', countryCode: 'ID'}, {countryName: 'Iran, Islamic Republic of', countryCode: 'IR'}, {countryName: 'Iraq', countryCode: 'IQ'}, {countryName: 'Ireland', countryCode: 'IE'}, {countryName: 'Israel', countryCode: 'IL'}, {countryName: 'Italy', countryCode: 'IT'}, {countryName: 'Jamaica', countryCode: 'JM'}, {countryName: 'Japan', countryCode: 'JP'}, {countryName: 'Jordan', countryCode: 'JO'}, {countryName: 'Kazakhstan', countryCode: 'KZ'}, {countryName: 'Kenya', countryCode: 'KE'}, {countryName: 'Kiribati', countryCode: 'KI'}, {countryName: 'North Korea', countryCode: 'KP'}, {countryName: 'South Korea', countryCode: 'KR'}, {countryName: 'Kuwait', countryCode: 'KW'}, {countryName: 'Kyrgyzstan', countryCode: 'KG'}, {countryName: 'Lao People\'s Democratic Republic', countryCode: 'LA'}, {countryName: 'Latvia', countryCode: 'LV'}, {countryName: 'Lebanon', countryCode: 'LB'}, {countryName: 'Lesotho', countryCode: 'LS'}, {countryName: 'Liberia', countryCode: 'LR'}, {countryName: 'Libya', countryCode: 'LY'}, {countryName: 'Liechtenstein', countryCode: 'LI'}, {countryName: 'Lithuania', countryCode: 'LT'}, {countryName: 'Luxembourg', countryCode: 'LU'}, {countryName: 'Macao', countryCode: 'MO'}, {countryName: 'Madagascar', countryCode: 'MG'}, {countryName: 'Malawi', countryCode: 'MW'}, {countryName: 'Malaysia', countryCode: 'MY'}, {countryName: 'Maldives', countryCode: 'MV'}, {countryName: 'Mali', countryCode: 'ML'}, {countryName: 'Malta', countryCode: 'MT'}, {countryName: 'Marshall Islands', countryCode: 'MH'}, {countryName: 'Martinique', countryCode: 'MQ'}, {countryName: 'Mauritania', countryCode: 'MR'}, {countryName: 'Mauritius', countryCode: 'MU'}, {countryName: 'Mayotte', countryCode: 'YT'}, {countryName: 'Mexico', countryCode: 'MX'}, {countryName: 'Micronesia, Federated States of', countryCode: 'FM'}, {countryName: 'Moldova, Republic of', countryCode: 'MD'}, {countryName: 'Monaco', countryCode: 'MC'}, {countryName: 'Mongolia', countryCode: 'MN'}, {countryName: 'Montserrat', countryCode: 'MS'}, {countryName: 'Morocco', countryCode: 'MA'}, {countryName: 'Mozambique', countryCode: 'MZ'}, {countryName: 'Myanmar', countryCode: 'MM'}, {countryName: 'Namibia', countryCode: 'NA'}, {countryName: 'Nauru', countryCode: 'NR'}, {countryName: 'Nepal', countryCode: 'NP'}, {countryName: 'Netherlands', countryCode: 'NL'}, {countryName: 'New Caledonia', countryCode: 'NC'}, {countryName: 'New Zealand', countryCode: 'NZ'}, {countryName: 'Nicaragua', countryCode: 'NI'}, {countryName: 'Niger', countryCode: 'NE'}, {countryName: 'Nigeria', countryCode: 'NG'}, {countryName: 'Niue', countryCode: 'NU'}, {countryName: 'Norfolk Island', countryCode: 'NF'}, {countryName: 'North Macedonia, Republic of', countryCode: 'MK'}, {countryName: 'Northern Mariana Islands', countryCode: 'MP'}, {countryName: 'Norway', countryCode: 'NO'}, {countryName: 'Oman', countryCode: 'OM'}, {countryName: 'Pakistan', countryCode: 'PK'}, {countryName: 'Palau', countryCode: 'PW'}, {countryName: 'Palestinian Territory, Occupied', countryCode: 'PS'}, {countryName: 'Panama', countryCode: 'PA'}, {countryName: 'Papua New Guinea', countryCode: 'PG'}, {countryName: 'Paraguay', countryCode: 'PY'}, {countryName: 'Peru', countryCode: 'PE'}, {countryName: 'Philippines', countryCode: 'PH'}, {countryName: 'Pitcairn', countryCode: 'PN'}, {countryName: 'Poland', countryCode: 'PL'}, {countryName: 'Portugal', countryCode: 'PT'}, {countryName: 'Puerto Rico', countryCode: 'PR'}, {countryName: 'Qatar', countryCode: 'QA'}, {countryName: 'Reunion', countryCode: 'RE'}, {countryName: 'Romania', countryCode: 'RO'}, {countryName: ['Russian Federation', 'Russia'], countryCode: 'RU'}, {countryName: 'Rwanda', countryCode: 'RW'}, {countryName: 'Saint Helena', countryCode: 'SH'}, {countryName: 'Saint Kitts and Nevis', countryCode: 'KN'}, {countryName: 'Saint Lucia', countryCode: 'LC'}, {countryName: 'Saint Pierre and Miquelon', countryCode: 'PM'}, {countryName: 'Saint Vincent and the Grenadines', countryCode: 'VC'}, {countryName: 'Samoa', countryCode: 'WS'}, {countryName: 'San Marino', countryCode: 'SM'}, {countryName: 'Sao Tome and Principe', countryCode: 'ST'}, {countryName: 'Saudi Arabia', countryCode: 'SA'}, {countryName: 'Senegal', countryCode: 'SN'}, {countryName: 'Seychelles', countryCode: 'SC'}, {countryName: 'Sierra Leone', countryCode: 'SL'}, {countryName: 'Singapore', countryCode: 'SG'}, {countryName: 'Slovakia', countryCode: 'SK'}, {countryName: 'Slovenia', countryCode: 'SI'}, {countryName: 'Solomon Islands', countryCode: 'SB'}, {countryName: 'Somalia', countryCode: 'SO'}, {countryName: 'South Africa', countryCode: 'ZA'}, {countryName: 'South Georgia and the South Sandwich Islands', countryCode: 'GS'}, {countryName: 'Spain', countryCode: 'ES'}, {countryName: 'Sri Lanka', countryCode: 'LK'}, {countryName: 'Sudan', countryCode: 'SD'}, {countryName: 'Suriname', countryCode: 'SR'}, {countryName: 'Svalbard and Jan Mayen', countryCode: 'SJ'}, {countryName: 'Eswatini', countryCode: 'SZ'}, {countryName: 'Sweden', countryCode: 'SE'}, {countryName: 'Switzerland', countryCode: 'CH'}, {countryName: 'Syrian Arab Republic', countryCode: 'SY'}, {countryName: 'Taiwan', countryCode: 'TW'}, {countryName: 'Tajikistan', countryCode: 'TJ'}, {countryName: 'Tanzania, United Republic of', countryCode: 'TZ'}, {countryName: 'Thailand', countryCode: 'TH'}, {countryName: 'Timor-Leste', countryCode: 'TL'}, {countryName: 'Togo', countryCode: 'TG'}, {countryName: 'Tokelau', countryCode: 'TK'}, {countryName: 'Tonga', countryCode: 'TO'}, {countryName: 'Trinidad and Tobago', countryCode: 'TT'}, {countryName: 'Tunisia', countryCode: 'TN'}, {countryName: 'Turkey', countryCode: 'TR'}, {countryName: 'Turkmenistan', countryCode: 'TM'}, {countryName: 'Turks and Caicos Islands', countryCode: 'TC'}, {countryName: 'Tuvalu', countryCode: 'TV'}, {countryName: 'Uganda', countryCode: 'UG'}, {countryName: 'Ukraine', countryCode: 'UA'}, {countryName: 'United Arab Emirates', countryCode: 'AE'}, {countryName: 'United Kingdom', countryCode: 'GB'}, {countryName: 'United States of America', countryCode: 'US'}, {countryName: 'United States Minor Outlying Islands', countryCode: 'UM'}, {countryName: 'Uruguay', countryCode: 'UY'}, {countryName: 'Uzbekistan', countryCode: 'UZ'}, {countryName: 'Vanuatu', countryCode: 'VU'}, {countryName: 'Venezuela', countryCode: 'VE'}, {countryName: 'Vietnam', countryCode: 'VN'}, {countryName: 'Virgin Islands, British', countryCode: 'VG'}, {countryName: 'Virgin Islands, U.S.', countryCode: 'VI'}, {countryName: 'Wallis and Futuna', countryCode: 'WF'}, {countryName: 'Western Sahara', countryCode: 'EH'}, {countryName: 'Yemen', countryCode: 'YE'}, {countryName: 'Zambia', countryCode: 'ZM'}, {countryName: 'Zimbabwe', countryCode: 'ZW'}, {countryName: 'Åland Islands', countryCode: 'AX'}, {countryName: 'Bonaire, Sint Eustatius and Saba', countryCode: 'BQ'}, {countryName: 'Curaçao', countryCode: 'CW'}, {countryName: 'Guernsey', countryCode: 'GG'}, {countryName: 'Isle of Man', countryCode: 'IM'}, {countryName: 'Jersey', countryCode: 'JE'}, {countryName: 'Montenegro', countryCode: 'ME'}, {countryName: 'Saint Barthélemy', countryCode: 'BL'}, {countryName: 'Saint Martin (French part)', countryCode: 'MF'}, {countryName: 'Serbia', countryCode: 'RS'}, {countryName: 'Sint Maarten (Dutch part)', countryCode: 'SX'}, {countryName: 'South Sudan', countryCode: 'SS'}, {countryName: 'Kosovo', countryCode: 'XK'}];

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
    const url = `${this.host}/${this.apiVersion}/courses/${courseId}?populate=category,lessons,reviews,courseObjects`;
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
