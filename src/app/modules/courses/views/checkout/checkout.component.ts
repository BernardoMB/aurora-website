import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Course } from '../../../../shared/models/course.model';
import { Store, select } from '@ngrx/store';
import { AuthState } from '../../../../store/auth/auth.state';
import { selectAuthCart, selectAuthIsAuthenticated, selectAuthUser } from '../../../../store/auth/auth.selectors';
import { Router } from '@angular/router';
import { removeCourseFromCart, purchaseCart } from '../../../../store/auth/auth.actions';
import { User } from '../../../../shared/models/user.model';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  isAuthenticatedSubscription: Subscription;
  isAuthenticated: boolean;
  userSubscription: Subscription;
  user: User;
  cartSubscription: Subscription;
  cart: Course[];
  get subtotal() {
    let subtotal = 0;
    if (this.cart) {
      this.cart.forEach(course => {
        subtotal = subtotal + course.price;
      });
      return subtotal;
    }
    return 0;
  }
  get total() {
    let total = 0;
    if (this.cart) {
      this.cart.forEach(course => {
        total = total + course.price * (1 - course.discount);
      });
      return total;
    }
    return 0;
  }

  constructor(
    private store: Store<AuthState>,
    private router: Router
  ) { }

  ngOnInit() {
    this.isAuthenticatedSubscription = this.store.pipe(select(selectAuthIsAuthenticated)).subscribe((isAuthenticated: boolean) => {
      if (isAuthenticated) {
        this.isAuthenticated = true;
      } else  {
        this.isAuthenticated = false;
        this.router.navigate(['/courses/cart']);
      }
    });
    this.userSubscription = this.store.pipe(select(selectAuthUser)).subscribe((user: User) => {
      if (user) {
        this.user = user;
      }
    });
    this.cartSubscription = this.store.pipe(select(selectAuthCart)).subscribe((courses: Course[]) => {
      if (courses && courses.length > 0) {
        this.cart = courses;
      } else {
        this.router.navigate(['/courses/cart']);
      }
    });
  }

  ngOnDestroy() {
    this.cartSubscription.unsubscribe();
    this.isAuthenticatedSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }

  onCompletePayment() {
    const courseIds = this.cart.map((course: Course) => course.id);
    this.store.dispatch(purchaseCart({ courses: courseIds, userId: this.user.id }));
  }

  onRemoveCourseFromCart(course: Course) {
    if (this.user) {
      this.store.dispatch(removeCourseFromCart({ courseId: course.id, userId: this.user.id }));
    }
  }

}
