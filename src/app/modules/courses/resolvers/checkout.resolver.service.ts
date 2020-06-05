import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { PaymentsService } from '../../../services/payments.service';
import { Store, select } from '@ngrx/store';
import { AuthState } from '../../../store/auth/auth.state';
import { selectAuthUser } from '../../../store/auth/auth.selectors';
import { User } from '../../../shared/models/user.model';
import { AuthService } from '../../../services/auth.service';

@Injectable()
export class CheckoutResolver implements Resolve<any> {
  user: User;

  constructor(
    private paymentsService: PaymentsService,
    private store: Store<AuthState>,
    private authService: AuthService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    this.store.pipe(select(selectAuthUser)).subscribe((user: User) => {
      if (user) {
        this.user = user;
      }
    });
    console.log('Resolver requesting checkout info');
    const availableBanks = this.paymentsService.getAvailableBanks();
    const userCards = this.authService.getUserCards();
    return forkJoin(availableBanks, userCards).pipe(
      map((allResponses) => {
        const checkoutInfo = {
          availableBanks: allResponses[0],
          userCards: allResponses[1]
        };
        return checkoutInfo;
      })
    );
  }
}
