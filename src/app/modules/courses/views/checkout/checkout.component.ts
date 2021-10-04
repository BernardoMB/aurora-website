import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Course } from '../../../../shared/models/course.model';
import { Store, select } from '@ngrx/store';
import { AuthState } from '../../../../store/auth/auth.state';
import { selectAuthCart, selectAuthIsAuthenticated, selectAuthUser } from '../../../../store/auth/auth.selectors';
import { Router, ActivatedRoute } from '@angular/router';
import { removeCourseFromCart, purchaseCartSuccess } from '../../../../store/auth/auth.actions';
import { User } from '../../../../shared/models/user.model';
import { CoursesService } from '../../services/courses.service';
import { MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../../../../services/auth.service';
import { MatDialogConfig, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EnterPinModalComponent } from '../../components/enter-pin-modal/enter-pin-modal.component';
import { IPaymentInfo } from '../../../../shared/interfaces/payment-info.interface';
import { EnterOtpModalComponent } from '../../components/enter-otp-modal/enter-otp-modal.component';
import { PaymentsService } from '../../../../services/payments.service';
import { ValidatePaymentDto } from '../../../../shared/dtos/validate-payment.dto';
import { ToastrService } from 'ngx-toastr';
import { EnterBillingInfoModalComponent, IBillingInfo } from '../../components/enter-billing-info-modal/enter-billing-info-modal.component';
import { IframeModalComponent } from '../../components/iframe-modal/iframe-modal.component';
import * as io from 'socket.io-client';
import { environment } from '../../../../../environments/environment';
import { PaymentErrorModalComponent } from '../../components/payment-error-modal/payment-error-modal.component';
import { MyErrorStateMatcher } from './control.error-matcher';
declare var Stripe: stripe.StripeStatic;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  providers: [{
    provide: MAT_RADIO_DEFAULT_OPTIONS,
    useValue: { color: 'primary' },
  }]
})
export class CheckoutComponent implements OnInit, OnDestroy, AfterViewInit {
  userSubscription: Subscription;
  user: User;
  showProgressSpinner = false;
  routeDataSubscription: Subscription;
  isAuthenticatedSubscription: Subscription;
  isAuthenticated: boolean;
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
  
  stripe;
  elements;

  constructor(
    private store: Store<AuthState>,
    private router: Router,
    private route: ActivatedRoute,
    public coursesService: CoursesService,
    private authService: AuthService,
    private paymentsService: PaymentsService,
    private toastrService: ToastrService
  ) {
    this.stripe = Stripe(environment.stripePublishableKey);
    this.elements = this.stripe.elements();
  }

  ngOnInit() {
    this.routeDataSubscription = this.route.data.subscribe((data) => {
      if (data.checkoutInfo) {
        const checkoutInfo: { availableBanks: any[], userCards: any[] } = data.checkoutInfo;
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
        console.log(this.cart);
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

  async ngAfterViewInit() {
    var _this = this;

    var style = {
      base: {
        color: "#32325d",
        fontFamily: 'Arial, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#32325d"
        }
      },
      invalid: {
        fontFamily: 'Arial, sans-serif',
        color: "#fa755a",
        iconColor: "#fa755a"
      }
    };
    
    var card = _this.elements.create("card", { style: style, hidePostalCode: true });
    card.mount("#card-element");
    
    card.on('change', ({error}) => {
      let errorContainer = document.getElementById('card-errors');
      let submitButton = document.getElementById('submit');
      if (error) {
        errorContainer.textContent = error.message;
        submitButton.setAttribute('disabled', 'disabled');
      } else {
        errorContainer.textContent = '';
        submitButton.removeAttribute('disabled');
      }
    });

    var form = document.getElementById('payment-form');

    form.addEventListener('submit', function(ev) {
      _this.loading(true);
      ev.preventDefault();
      _this.onCompletePayment(card);
    });
  }

  /**
   * Function called when user hits complete payment button.
   * Use this approach for production environment
   *
   * @memberof CheckoutComponent
   */
  onCompletePayment(card) {
    const courseIds = this.cart.map((course: Course) => course.id);
    this.purchaseCart(
      this.user.id,
      courseIds,
      card
    );
  }

  async purchaseCart(userId: string, courses: string[], card) {
    var _this = this;
    this.authService.purchaseCart2(userId, courses, 'NEW_CARD', 'Nigeria').pipe(
      catchError((error) => {
        alert('Error ocurred');
        // Determine type of error. Handle Stripe error or Aurora API error.
        console.error('Error creating payment intent for purchasing cart', error);
        // TODO: Handle Stripe error
        throw error;
      })
    ).subscribe(async (res: { user: User, paymentIntentClientSecret: string, purchaseCompleted: boolean }) => {
      if (res.user.cart.length === 0 && res.purchaseCompleted) {
        this.succesfullPurchase(res.user);
      } else {
        console.log({res});
        const { paymentIntentClientSecret } = res;
        if (paymentIntentClientSecret
          && paymentIntentClientSecret !== undefined
          && paymentIntentClientSecret !== ""
          && paymentIntentClientSecret.length !== 0
        ) {
          // Handle succesfull payment intent.
          
          console.log('Completing payment');
          const clientSecret = paymentIntentClientSecret;
          this.stripe.confirmCardPayment(clientSecret, {
            payment_method: {
              card: card,
              // TODO: Collect proper billing details
              billing_details: {
                address: {
                  city: null,
                  country: null,
                  line1: null,
                  line2: null,
                  postal_code: '53120', // TODO: Make dynamic
                  state: null
                },
                email: null,
                name: `${res.user.name} ${res.user.lastName}`,
                phone: null
              }
            },
            receipt_email: (document.getElementById('email') as any).value,
            shipping: null // TODO: Make non-null
          }).then((result) => {
            if (result.error) {
              // Show error to your customer (e.g., insufficient funds)
              console.log(result.error.message);
              this.showError(result.error.message);
            } else {
              // The payment has been processed!
              if (result.paymentIntent.status === 'succeeded') {
                // Show a success message to your customer
                // There's a risk of the customer closing the window before callback
                // execution. Set up a webhook or plugin to listen for the
                // payment_intent.succeeded event that handles any business critical
                // post-payment actions.
                _this.orderComplete(result.paymentIntent.id);
                console.log('Payment succeded');
                console.log(result);
                _this.loading(false);
                setTimeout(() => {
                  _this.succesfullPurchase(res.user);
                }, 3000);
              }
            }
          });
        }
      }
    });
  }

  succesfullPurchase(user: User) {
    this.toastrService.success('Successful purchase.', 'Enjoy!');
    this.store.dispatch(purchaseCartSuccess(user));
    this.router.navigate(['courses/my-courses']);
  }

  onRemoveCourseFromCart(course: Course) {
    if (this.user) {
      this.store.dispatch(removeCourseFromCart({ courseId: course.id, userId: this.user.id }));
    }
  }

  // Shows a success message when the payment is complete
  orderComplete(paymentIntentId: string) {
    this.loading(false);
    /* document
      .querySelector(".result-message a")
      .setAttribute(
        "href",
        "https://dashboard.stripe.com/test/payments/" + paymentIntentId
      ); */
    document.querySelector(".result-message").classList.remove("hidden");
    /* document.querySelector("button").disabled = true; */
    let submitButton = document.getElementById('submit');
    submitButton.setAttribute('disabled', 'disabled');
  };

  // Show a spinner on payment submission
  loading(isLoading: boolean) {
    if (isLoading) {
      // Disable the button and show a spinner
      document.querySelector("button").disabled = true;
      document.querySelector("#spinner").classList.remove("hidden");
      document.querySelector("#button-text").classList.add("hidden");
    } else {
      document.querySelector("button").disabled = false;
      document.querySelector("#spinner").classList.add("hidden");
      document.querySelector("#button-text").classList.remove("hidden");
    }
  };

  // Show the customer the error from Stripe if their card fails to charge
  showError(errorMsgText: string) {
    this.loading(false);
    this.toastrService.error('Could not validate your payment', errorMsgText, { timeOut: 10 * 1000, disableTimeOut: 'extendedTimeOut' });
    var errorMsg = document.querySelector("#card-errors");
    errorMsg.textContent = errorMsgText;
    setTimeout(function() {
      errorMsg.textContent = "";
    }, 10 * 1000);
  };
}
