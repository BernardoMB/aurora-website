import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Reaction } from '../models/community-interaction';
import { ReactionsService } from '../services/reactions.service';

@Injectable()
export class ReactionsResolver implements Resolve<Reaction[]> {
  constructor(private readonly reactionsService: ReactionsService) {}
  resolve(
    route: ActivatedRouteSnapshot,
  ): Observable<Reaction[]> | Promise<Reaction[]> | Reaction[] {
    return this.reactionsService.getReactions();
  }
}
