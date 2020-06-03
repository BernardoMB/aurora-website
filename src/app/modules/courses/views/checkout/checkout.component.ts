import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Course } from '../../../../shared/models/course.model';
import { Store, select } from '@ngrx/store';
import { AuthState } from '../../../../store/auth/auth.state';
import { selectAuthCart, selectAuthIsAuthenticated, selectAuthUser } from '../../../../store/auth/auth.selectors';
import { Router, ActivatedRoute } from '@angular/router';
import { removeCourseFromCart, purchaseCart } from '../../../../store/auth/auth.actions';
import { User } from '../../../../shared/models/user.model';
import { CoursesService } from '../../services/courses.service';
import { MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
import { FormGroup, ValidationErrors, FormControl, Validators, AbstractControl } from '@angular/forms';
import { take } from 'rxjs/operators';

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
  routeDataSubscription: Subscription;
  isAuthenticatedSubscription: Subscription;
  isAuthenticated: boolean;
  availableBanks;
  userSubscription: Subscription;
  user: User;
  userCards; // TODO: Specify type
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
  paymentMethod = 'NEW_CARD'; // Default payment method
  showBankPaymentForm = false;
  showNewCardPaymentForm = true;
  expirationYears: number[];
  rememberCard = true;
  selectedUserCard;

  countryControl = new FormControl('', [Validators.required]);
  newCardForm = new FormGroup({
    nameOnCardControl: new FormControl('', [Validators.required]),
    cardNumberControl: new FormControl('', [
      Validators.required,
      (control: AbstractControl): {[key: string]: any} | null => {
        let isValid: boolean;
        if (control.value) {
          const cardNumber = control.value.toString().trim().replace(/\s/g, '');
          if (cardNumber) {
            if (cardNumber.length === 16) {
              isValid = true;
            } else {
              isValid = false;
            }
            return isValid ? null : { notAValidNumber: {value: control.value}};
          }
        }
      }
    ]),
    expiryMonthControl: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]),
    expiryYearControl: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]),
    securityCodeControl: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(4),
      (control: AbstractControl): {[key: string]: any} | null => {
        let isValid: boolean;
        if (control.value) {
          const securityCode = control.value.toString();
          if (securityCode) {
            // console.log(cardNumber.toString().length);
            if (3 <= securityCode.length && securityCode.length <= 4) {
              isValid = true;
            } else {
              isValid = false;
            }
            return isValid ? null : { notAValidNumber: {value: control.value}};
          }
        }
      }
    ]),
    rememberCardControl: new FormControl('')
  }, /* {
    validators: (control: FormGroup): ValidationErrors | null => {
      // control is the form group
      const isValid = true;
      return isValid ? null : { anyValue: true };
    }
  } */);

  bankAccountForm = new FormGroup({
    accountBankControl: new FormControl('', [Validators.required]),
    accountNumbercontrol: new FormControl('', [Validators.required]),
    bvnControl: new FormControl('', [Validators.required]),
    passcodeControl: new FormControl(''),
    firstNameControl: new FormControl('', [Validators.required]),
    lastNameControl: new FormControl('', [Validators.required])
  }, /* {
    validators: (control: FormGroup): ValidationErrors | null => {
      // control is the form group
      const isValid = true;
      return isValid ? null : { anyValue: true };
    }
  } */);

  constructor(
    private store: Store<AuthState>,
    private router: Router,
    private route: ActivatedRoute,
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
    this.routeDataSubscription = this.route.data.subscribe((data) => {
      if (data.checkoutInfo) {
        const checkoutInfo: { availableBanks: any[], userCards: any[] } = data.checkoutInfo;
        this.availableBanks = checkoutInfo.userCards;
        this.userCards = checkoutInfo.userCards;
      }
    });
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
    if (this.paymentMethod === 'NEW_CARD') {
      if (this.newCardForm.valid && this.countryControl.valid) {
        console.log('TODO: Dispatch purchase user cart action');
        const courseIds = this.cart.map((course: Course) => course.id);
        this.store.dispatch(purchaseCart({
          userId: this.user.id,
          courses: courseIds,
          paymentMethod: this.paymentMethod,
          country: this.countryControl.value,
          paymentInfo: {
            nameOnCard: this.newCardForm.get('nameOnCardControl').value.toString().trim(),
            cardNumber: this.newCardForm.get('cardNumberControl').value.toString().trim().replace(/\s/g, ''),
            expiryMonth: this.newCardForm.get('expiryMonthControl').value.toString().trim(),
            expiryYear: this.newCardForm.get('expiryYearControl').value.toString().trim(),
            securityCode: this.newCardForm.get('securityCodeControl').value.toString().trim(),
            rememberCard: this.newCardForm.get('rememberCardControl').value
          }
        }));
      } else {
        alert('Payment form is invalid');
      }
    } else if (this.paymentMethod === 'USER_CARD') {
      // User is paying with a card he has previously used
      alert('Implement this payment method');
      if (this.cardSelected && this.countryControl.valid) {
        console.log('TODO: Dispatch purchase user cart action');
      }
    } else if (this.paymentMethod === 'BANK_ACCOUNT') {
      // User is paying using a bank account
      if (this.bankAccountForm.valid && this.countryControl.valid) {
        console.log('TODO: Dispatch purchase user cart action');
      } else {
        alert('Bank account form is not valid');
      }
    } else {
      alert('No payment method selected');
    }
  }

  toggleRememberCard() {
    this.rememberCard = !this.rememberCard;
  }

  toggleNewCardForm() {
    if (this.showNewCardPaymentForm) {
      this.showNewCardPaymentForm = false;
      this.paymentMethod = null;
    } else {
      this.showNewCardPaymentForm = true;
      this.paymentMethod = 'NEW_CARD';
      this.showBankPaymentForm = false;
      this.selectedUserCard = null;
    }
  }

  toggleBankForm() {
    if (this.showBankPaymentForm) {
      this.showBankPaymentForm = false;
      this.paymentMethod = null;
    } else {
      this.showBankPaymentForm = true;
      this.paymentMethod = 'BANK_ACCOUNT';
      this.showNewCardPaymentForm = false;
      this.selectedUserCard = null;
    }
  }

  cardSelected(card) {
    this.selectedUserCard = card;
    this.paymentMethod = 'USER_CARD';
    this.showNewCardPaymentForm = false;
    this.showBankPaymentForm = false;
  }

  onRemoveCourseFromCart(course: Course) {
    if (this.user) {
      this.store.dispatch(removeCourseFromCart({ courseId: course.id, userId: this.user.id }));
    }
  }

  logFormValue() {
    console.log(this.newCardForm.value);
  }

}
