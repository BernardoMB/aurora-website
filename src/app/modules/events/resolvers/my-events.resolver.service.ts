import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { EventsService } from '../services/events.service';
import { mergeMap, map, take } from 'rxjs/operators';
import { User } from '../../../shared/models/user.model';
import { Store, select } from '@ngrx/store';
import { AuthState } from '../../../store/auth/auth.state';
import { selectAuthUser } from '../../../store/auth/auth.selectors';
import { AuthService } from '../../../services/auth.service';

@Injectable()
export class MyEventsResolver implements Resolve<any> {
  constructor(
    private eventsService: EventsService,
    private store: Store<AuthState>,
    private router: Router,
    private authService: AuthService,
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<any> | Promise<any> | any {
    return this.authService.getUserInfo().pipe(
      mergeMap((user: User) => {
        if (user) {
          return this.eventsService
            .getUserEvents()
            .pipe(map((events) => ({ events })));
        }
      }),
    );
  }
}
