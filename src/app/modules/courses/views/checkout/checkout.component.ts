import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Course } from '../../../../shared/models/course.model';
import { Store, select } from '@ngrx/store';
import { AuthState } from '../../../../store/auth/auth.state';
import { selectAuthCart, selectAuthIsAuthenticated, selectAuthUser } from '../../../../store/auth/auth.selectors';
import { Router } from '@angular/router';
import { removeCourseFromCart, purchaseCart } from '../../../../store/auth/auth.actions';
import { User } from '../../../../shared/models/user.model';
import { CoursesService } from '../../services/courses.service';
import { MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';

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
  showBankPaymentForm = false;
  showNewCardPaymentForm = true;
  expirationYears: number[];
  rememberCard = true;
  selectedUserCard;

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

  // Pay button
  onCompletePayment() {
    // TODO: Validate form
    const courseIds = this.cart.map((course: Course) => course.id);
    // TODO: Pay payment data here
    this.store.dispatch(purchaseCart({ courses: courseIds, userId: this.user.id }));
  }

  toggleRememberCard() {
    this.rememberCard = !this.rememberCard;
  }

  toggleNewCardForm() {
    if (this.showNewCardPaymentForm) {
      this.showNewCardPaymentForm = false;
    } else {
      this.showNewCardPaymentForm = true;
      this.showBankPaymentForm = false;
      this.selectedUserCard = null;
    }
  }

  toggleBankForm() {
    if (this.showBankPaymentForm) {
      this.showBankPaymentForm = false;
    } else {
      this.showBankPaymentForm = true;
      this.showNewCardPaymentForm = false;
      this.selectedUserCard = null;
    }
  }

  cardSelected(card) {
    this.selectedUserCard = card;
    this.showNewCardPaymentForm = false;
    this.showBankPaymentForm = false;
  }

  onRemoveCourseFromCart(course: Course) {
    if (this.user) {
      this.store.dispatch(removeCourseFromCart({ courseId: course.id, userId: this.user.id }));
    }
  }

}
