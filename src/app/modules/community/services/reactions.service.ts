import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Reaction } from '../models/community-interaction';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReactionsService {
  prefix = 'reactions';

  get baseUrl() {
    return `${environment.host}/${environment.apiVersion}/${this.prefix}`;
  }

  constructor(private http: HttpClient) {}

  /**
   * Get community reactions
   *
   * @returns {Observable<Reaction[]>}
   * @memberof ArticlesService
   */
  getReactions(): Observable<Reaction[]> {
    console.log(`Community service getting reactions`);
    return this.http.get<Reaction[]>(`${this.baseUrl}`);
    // return this.getFakeArticle(articleId);
  }
}
