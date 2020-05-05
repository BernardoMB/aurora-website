import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Course } from '../../../../shared/models/course.model';
import { Store, select } from '@ngrx/store';
import { AuthState } from '../../../../store/auth/auth.state';
import { selectAuthCart, selectAuthIsAuthenticated, selectAuthUser } from '../../../../store/auth/auth.selectors';
import { Router } from '@angular/router';
import { removeCourseFromCart, purchaseCart } from '../../../../store/auth/auth.actions';
import { User } from '../../../../shared/models/user.model';
import { Page, PagedData } from '../../../../shared/utils';
import { CoursesService } from '../../services/courses.service';
import { MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  providers: [{
    provide: MAT_RADIO_DEFAULT_OPTIONS,
    useValue: { color: 'primary' },
  }]
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
  showPaymentForm = true;
  expirationYears: number[];
  rememberCard = true;

  constructor(
    private store: Store<AuthState>,
    private router: Router,
    public coursesService: CoursesService
  ) {
    this.expirationYears = [];
    const date = new Date();
    const currentYear = date.getFullYear();
    for (let i = 0; i <= 20; i++) {
      this.expirationYears.push(currentYear + i);
    }
  }

  ngOnInit() {
    this.isAuthenticatedSubscription = this.store.pipe(select(selectAuthIsAuthenticated)).subscribe((isAuthenticated: boolean) => {
      if (isAuthenticated) {
        this.isAuthenticated = true;
      } else  {
        this.isAuthenticated = false;
        console.log('CheckoutComponent: Authenticated state is false. Redirecting to /courses/cart');
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
        console.log('CheckoutComponent: No courses in order. Redirecting to /courses/cart');
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

  cardSelected(card) {
    console.log('Card selected', card);
    this.showPaymentForm = false;
  }

  toggleRememberCard() {
    console.log('Togglig');
    this.rememberCard = !this.rememberCard;
  }

  toggleForm() {
    console.log('Togglig');
    this.showPaymentForm = !this.showPaymentForm;
  }

}
