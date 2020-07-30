import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, of, from } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { stringifyUrl, parseUrl } from 'query-string';

import { Event } from '../models/event.model';
import { environment } from '../../../../environments/environment';
import { Page } from '../../../shared/models/page.model';
import { PagedData } from '../../../shared/models/paged-data.model';
import { shuffleArray } from '../../../shared/utils';
import { ServerPagedDataDto } from '../../../shared/models/dto/server-paged-data.dto';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  prefix = 'events';

  get baseUrl() {
    return `${environment.host}/${environment.apiVersion}/${this.prefix}`;
  }

  constructor(private http: HttpClient) {}

  /**
   * Get an event by id. No pagination required
   *
   * @param {string} eventId
   * @returns {Observable<Event>}
   * @memberof EventsService
   */
  getEvent(eventId: string): Observable<Event> {
    console.log(`Event service: Getting event with id ${eventId}`);
    return this.http.get<Event>(`${this.baseUrl}/${eventId}`);
    // return this.getFakeEvent(eventId);
  }

  /**
   * Get events page.
   *
   * @param {Page} page
   * @returns {Observable<PagedData<Event>>}
   * @memberof EventsService
   */
  getEventsPageData(page: Page): Observable<PagedData<Event>> {
    console.log('Events service: Getting events page');
    const query = {
      ...page.toPaginationParams(),
      // sort: { 'createdAt': 'desc' },
    };
    // return this.getFakeEvents(this.getUrl(query)).pipe(
    return this.http
      .get<ServerPagedDataDto<Event>>(this.getUrl(query))
      .pipe(map((res) => new PagedData<Event>(res, page)));
  }

  /**
   * Get featured events page.
   *
   * @param {Page} page
   * @returns {Observable<PagedData<Event>>}
   * @memberof EventsService
   */
  getFeaturedEventsPageData(page: Page): Observable<PagedData<Event>> {
    console.log('Events service: Getting featured events page');
    const query = {
      ...page.toPaginationParams(),
      // sort: { 'createdAt': 'desc' },
      // TODO: add Featured filtering
      // featured: true,
    };
    // return this.getFakeEvents(this.getUrl(query), true).pipe(
    return this.http
      .get<ServerPagedDataDto<Event>>(this.getUrl(query))
      .pipe(map((res) => new PagedData<Event>(res, page)));
  }

  /**
   * Get trending events page.
   *
   * @param {Page} page
   * @returns {Observable<PagedData<Event>>}
   * @memberof EventsService
   */
  getTrendingEventsPageData(page: Page): Observable<PagedData<Event>> {
    console.log('Events service: Getting featured events page');
    const query = {
      ...page.toPaginationParams(),
      // TODO
      // sort: { 'subscribed.length': 'desc' },
      // featured: true,
    };
    // return this.getFakeEvents(this.getUrl(query), true).pipe(
    return this.http
      .get<ServerPagedDataDto<Event>>(this.getUrl(query))
      .pipe(map((res) => new PagedData<Event>(res, page)));
  }

  /**
   * Get nearby events page.
   *
   * @param {Page} page
   * @returns {Observable<PagedData<Event>>}
   * @memberof EventsService
   */
  getNearbyEventsPageData(page: Page): Observable<PagedData<Event>> {
    console.log('Events service: Getting nearby events page');

    return from(this.getLocation()).pipe(
      map(([latitude, longitude]) => ({
        ...page.toPaginationParams(),
        latitude,
        longitude,
        meterRadius: 5000,
      })),
      switchMap((query) =>
        // this.getFakeEvents(this.getUrl(query, '/near/location'), true),
        this.http.get<ServerPagedDataDto<Event>>(
          this.getUrl(query, '/near/location'),
        ),
      ),
      map((res) => new PagedData<Event>(res, page)),
    );
  }

  /**
   * Get related events page.
   *
   * @param {Page} page
   * @param {Event} event
   * @returns {Observable<PagedData<Event>>}
   * @memberof EventsService
   */
  getRelatedEventsPageData(
    page: Page,
    event: Event,
  ): Observable<PagedData<Event>> {
    console.log('Events service: Getting related events page');
    const query = {
      ...page.toPaginationParams(),
      sort: { 'subscribed.length': 'desc' },
      event,
    };
    // return this.getFakeEvents(this.getUrl(query), true).pipe(
    return this.http
      .get<ServerPagedDataDto<Event>>(this.getUrl(query))
      .pipe(map((res) => new PagedData<Event>(res, page)));
  }

  subscribeToEvent() {
    // TODO: Implement this method
    throw new Error('Not Implemented!');
  }

  /**
   * @param  {any={}} query - the query to be passed to the [query-string library]{@link https://github.com/sindresorhus/query-string#readme}
   * @param  {} subUrlSegment='' - the suburl segment to concatenate to the baseUrl
   */
  private getUrl(query: any = {}, subUrlSegment = '') {
    return stringifyUrl(
      { url: this.baseUrl + subUrlSegment, query },
      {
        skipNull: true,
        skipEmptyString: true,
      },
    );
  }

  private getLocation(): Promise<[number, number]> {
    return new Promise((resolve, _reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          resolve([position.coords.latitude, position.coords.longitude]);
        });
      } else {
        alert(
          'Your browser does not support geolocation, displaying events close to Lagos',
        );
        resolve([6.465422, 3.406448]);
      }
    });
  }

  private getFakeEvents(
    url: string,
    shuffle = false,
  ): Observable<ServerPagedDataDto<Event>> {
    const { query } = parseUrl(url, { arrayFormat: 'comma' });
    console.log(query);
    const { skip, limit } = query;
    return this.http.get<Event[]>('/assets/fake-data/fake-events.json').pipe(
      map((items) => {
        const data = shuffle ? shuffleArray<Event>(items) : items;
        const count = data.length;
        if (typeof skip !== undefined && typeof limit !== undefined) {
          return {
            count,
            data: data.slice(Number(skip), Number(skip) + Number(limit)),
          };
        }
        return {
          count,
          data,
        };
      }),
    );
  }

  private getFakeEvent(id: string): Observable<Event> {
    console.log(id);
    return this.http.get<Event[]>('/assets/fake-data/fake-events.json').pipe(
      switchMap((items) => {
        const index = items.findIndex((i) => i.id === id);
        if (index === -1) {
          return throwError(new Error('Event not found!'));
        }
        return of(items[index]);
      }),
    );
  }
}
