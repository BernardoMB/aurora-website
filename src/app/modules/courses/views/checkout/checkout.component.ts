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
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';
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
  activeCurrency;
  // Supported payment methods for the store.
  // Some payment methods support only a subset of currencies.
  // Make sure to check the docs: https://stripe.com/docs/sources
  configPaymentMethods = [
    // 'ach_credit_transfer', // usd (ACH Credit Transfer payments must be in U.S. Dollars)
    'alipay', // aud, cad, eur, gbp, hkd, jpy, nzd, sgd, or usd.
    'bancontact', // eur (Bancontact must always use Euros)
    'card', // many (https://stripe.com/docs/currencies#presentment-currencies)
    'eps', // eur (EPS must always use Euros)
    'ideal', // eur (iDEAL must always use Euros)
    'giropay', // eur (Giropay must always use Euros)
    'multibanco', // eur (Multibanco must always use Euros)
    // 'sepa_debit', // Restricted. See docs for activation details: https://stripe.com/docs/sources/sepa-debit
    'p24', // eur, pln
    'sofort', // eur (SOFORT must always use Euros)
    'wechat', // aud, cad, eur, gbp, hkd, jpy, sgd, or usd.
    'au_becs_debit', //aud
  ];
  /**
   * Display the relevant payment methods for a selected country.
   */
  // List of relevant countries for the payment methods supported in this demo.
  // Read the Stripe guide: https://stripe.com/payments/payment-methods-guide
  paymentMethods = {
    ach_credit_transfer: {
      name: 'Bank Transfer',
      flow: 'receiver',
      countries: ['US'],
      currencies: ['usd'],
    },
    alipay: {
      name: 'Alipay',
      flow: 'redirect',
      countries: ['CN', 'HK', 'SG', 'JP'],
      currencies: [
        'aud',
        'cad',
        'eur',
        'gbp',
        'hkd',
        'jpy',
        'nzd',
        'sgd',
        'usd',
      ],
    },
    bancontact: {
      name: 'Bancontact',
      flow: 'redirect',
      countries: ['BE'],
      currencies: ['eur'],
    },
    card: {
      name: 'Card',
      flow: 'none',
    },
    eps: {
      name: 'EPS',
      flow: 'redirect',
      countries: ['AT'],
      currencies: ['eur'],
    },
    ideal: {
      name: 'iDEAL',
      flow: 'redirect',
      countries: ['NL'],
      currencies: ['eur'],
    },
    giropay: {
      name: 'Giropay',
      flow: 'redirect',
      countries: ['DE'],
      currencies: ['eur'],
    },
    multibanco: {
      name: 'Multibanco',
      flow: 'receiver',
      countries: ['PT'],
      currencies: ['eur'],
    },
    p24: {
      name: 'Przelewy24',
      flow: 'redirect',
      countries: ['PL'],
      currencies: ['eur', 'pln'],
    },
    sepa_debit: {
      name: 'SEPA Direct Debit',
      flow: 'none',
      countries: [
        'FR',
        'DE',
        'ES',
        'BE',
        'NL',
        'LU',
        'IT',
        'PT',
        'AT',
        'IE',
        'FI',
      ],
      currencies: ['eur'],
    },
    sofort: {
      name: 'SOFORT',
      flow: 'redirect',
      countries: ['DE', 'AT'],
      currencies: ['eur'],
    },
    wechat: {
      name: 'WeChat',
      flow: 'none',
      countries: ['CN', 'HK', 'SG', 'JP'],
      currencies: [
        'aud',
        'cad',
        'eur',
        'gbp',
        'hkd',
        'jpy',
        'nzd',
        'sgd',
        'usd',
      ],
    },
    au_becs_debit: {
      name: 'BECS Direct Debit',
      flow: 'none',
      countries: ['AU'],
      currencies: ['aud'],
    },
  };
  // Cusotm UI behaviour
  showSuccesfullMessage = false;
  paymentForm;
  submitButton;

  constructor(
    private store: Store<AuthState>,
    private router: Router,
    private route: ActivatedRoute,
    public coursesService: CoursesService,
    private authService: AuthService,
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
    var style = {
      base: {
        iconColor: '#666ee8',
        color: '#31325f',
        fontWeight: 400,
        /* fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif', */
        fontSmoothing: 'antialiased',
        fontSize: '15px',
        '::placeholder': {
          color: '#aab7c4',
        },
        ':-webkit-autofill': {
          color: '#666ee8',
        },
      },
      invalid: {
        fontFamily: 'Arial, sans-serif',
        color: "#fa755a",
        iconColor: "#fa755a"
      }
    };
    
    var card = this.elements.create("card", { style: style, hidePostalCode: true });
    card.mount("#card-element");
    
    card.on('change', ({error}) => {
      const cardErrors = document.getElementById('card-errors');
      //const submitButton = form.querySelector('button[type=submit]');
      if (error) {
        cardErrors.textContent = error.message;
        cardErrors.classList.add('visible');
        this.submitButton.setAttribute('disabled', 'disabled');
      } else {
        cardErrors.textContent = '';
        cardErrors.classList.remove('visible');
        this.submitButton.removeAttribute('disabled');
      }
    });

    /**
     * Handle the form submission.
     * This uses Stripe.js to confirm the PaymentIntent using payment details collected
     * with Elements.
     * Please note this form is not submitted when the user chooses the "Pay" button
     * or Apple Pay, Google Pay, and Microsoft Pay since they provide name and
     * shipping information directly.
     */
     this.paymentForm = document.getElementById('payment-form');
     this.submitButton = this.paymentForm.querySelector('button[type=submit]');
    
    // Listen to changes to the user-selected country.
    this.paymentForm.querySelector('select[name=country]').addEventListener('change', (event) => {
      event.preventDefault();
      this.selectCountry((event.target as any).value);
    });

    this.paymentForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      this.loading(true);

      // Retrieve the user information from the form.
      const payment = (this.paymentForm.querySelector('input[name=payment]:checked') as any).value;
      const name = (this.paymentForm.querySelector('input[name=name]') as any).value;
      const country = (this.paymentForm.querySelector('select[name=country] option:checked') as any).value;
      const email = (this.paymentForm.querySelector('input[name=email]') as any).value;
      const phone = (this.paymentForm.querySelector('input[name=phone]') as any).value;
      const billingAddress = {
        line1: (this.paymentForm.querySelector('input[name=address]') as any).value,
        postal_code: (this.paymentForm.querySelector('input[name=postal_code]') as any).value,
      };
      const shipping = {
        name,
        address: {
          line1: (this.paymentForm.querySelector('input[name=address]') as any).value,
          city: (this.paymentForm.querySelector('input[name=city]') as any).value,
          postal_code: (this.paymentForm.querySelector('input[name=postal_code]') as any).value,
          state: (this.paymentForm.querySelector('input[name=state]') as any).value,
          country,
        },
      };
      // Disable the Pay button to prevent multiple click events.
      (this.submitButton as any).disabled = true;
      this.submitButton.textContent = 'Processing…';

      const courseIds = this.cart.map((course: Course) => course.id);

      this.authService.purchaseCart2(this.user.id, courseIds, 'NEW_CARD', 'Nigeria').pipe(
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
            // Create the payment request.

            console.log('Completing payment');
            const clientSecret = paymentIntentClientSecret;

            if (payment === 'card') {
              const response = await this.stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                  card,
                  // TODO: Collect proper billing details
                  billing_details: {
                    address: billingAddress,
                    name,
                    email,
                    phone
                  }
                },
                receipt_email: (this.paymentForm.querySelector('input[name=email]') as any).value,
                shipping: null // TODO: Make non-null
              });
              this.handlePayment(response, res.user);
            }
          }
        }
      });
    });

    // Listen to changes to the payment method selector.
    for (let input of (document.querySelectorAll('input[name=payment]') as any)) {
      input.addEventListener('change', (event) => {
        event.preventDefault();
        const payment = (this.paymentForm.querySelector('input[name=payment]:checked') as any).value;
        const flow = this.paymentMethods[payment].flow;

        // Update button label.
        //updateButtonLabel(event.target.value);

        // Show the relevant details, whether it's an extra element or extra information for the user.
        this.paymentForm.querySelector('.payment-info.card').classList.toggle('visible', payment === 'card');
        this.paymentForm.querySelector('.payment-info.ideal').classList.toggle('visible', payment === 'ideal');
        this.paymentForm.querySelector('.payment-info.sepa_debit').classList.toggle('visible', payment === 'sepa_debit');
        this.paymentForm.querySelector('.payment-info.wechat').classList.toggle('visible', payment === 'wechat');
        this.paymentForm.querySelector('.payment-info.au_becs_debit').classList.toggle('visible', payment === 'au_becs_debit');
        this.paymentForm.querySelector('.payment-info.redirect').classList.toggle('visible', flow === 'redirect');
        this.paymentForm.querySelector('.payment-info.receiver').classList.toggle('visible', flow === 'receiver');
        document.getElementById('card-errors').classList.remove('visible');
      });
    }
    
    // Select the default country from the config on page load.
    let country = 'MX';
    // Override it if a valid country is passed as a URL parameter.
    const urlParams = new URLSearchParams(window.location.search);
    let countryParam = urlParams.get('country')
      ? urlParams.get('country').toUpperCase()
      : 'MX';
    if (this.paymentForm.querySelector(`option[value="${countryParam}"]`)) {
      country = countryParam;
    }
    this.selectCountry(country);
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

  // Show the right controls for the selected country
  selectCountry(country: string) {
    const selector = document.getElementById('country');
    (selector.querySelector(`option[value=${country}]`) as any).selected = 'selected';
    selector.className = `field ${country.toLowerCase()}`;
    //update currency if there's a currency for that country
    switch (country) {
      case 'AU':
        this.activeCurrency = 'mxn';
        break;
      default:
        this.activeCurrency = 'mxn';
        break;
    }
    // Trigger the methods to show relevant fields and payment methods on page load.
    this.showRelevantFormFields(country);
    this.showRelevantPaymentMethods(country);
  };

   // Show only form fields that are relevant to the selected country.
   showRelevantFormFields(country: string) {
    if (!country) {
      country = (this.paymentForm.querySelector('select[name=country] option:checked') as any).value;
    }
    const zipLabel = this.paymentForm.querySelector('label.zip');
    // Only show the state input for the United States.
    zipLabel.parentElement.classList.toggle(
      'with-state',
      ['AU', 'US'].includes(country)
    );
    // Update the ZIP label to make it more relevant for each country.
    const zipInput = this.paymentForm.querySelector('label.zip input');
    const zipSpan = this.paymentForm.querySelector('label.zip span');
    switch (country) {
      case 'US':
        (zipSpan as any).innerText = 'ZIP';
        (zipInput as any).placeholder = '94103';
        break;
      case 'GB':
        (zipSpan as any).innerText = 'Postcode';
        (zipInput as any).placeholder = 'EC1V 9NR';
        break;
      case 'AU':
        (zipSpan as any).innerText = 'Postcode';
        (zipInput as any).placeholder = '3000';
        break;
      default:
        (zipSpan as any).innerText = 'Postal Code';
        (zipInput as any).placeholder = '94103';
        break;
    }

    // Update the 'City' to appropriate name
    const cityInput = this.paymentForm.querySelector('label.city input');
    const citySpan = this.paymentForm.querySelector('label.city span');
    switch (country) {
      case 'AU':
        (citySpan as any).innerText = 'City / Suburb';
        (cityInput as any).placeholder = 'Melbourne';
        break;
      default:
        (citySpan as any).innerText = 'City';
        (cityInput as any).placeholder = 'San Francisco';
        break;
    }
  };

  // Show only the payment methods that are relevant to the selected country.
  showRelevantPaymentMethods(country) {
    if (!country) {
      country = (this.paymentForm.querySelector('select[name=country] option:checked') as any).value;
    }

    const paymentInputs = this.paymentForm.querySelectorAll('input[name=payment]');
    for (let i = 0; i < paymentInputs.length; i++) {
      let input = paymentInputs[i];
      input.parentElement.classList.toggle(
        'visible',
        (input as any).value === 'card' ||
          (this.configPaymentMethods.includes((input as any).value) &&
            this.paymentMethods[(input as any).value].countries.includes(country) &&
            this.paymentMethods[(input as any).value].currencies.includes(this.activeCurrency))
      );
    }

    // Hide the tabs if card is the only available option.
    const paymentMethodsTabs = document.getElementById('payment-methods');
    paymentMethodsTabs.classList.toggle(
      'visible',
      paymentMethodsTabs.querySelectorAll('li.visible').length > 1
    );

    // Check the first payment option again.
    (paymentInputs[0] as any).checked = 'checked';
    this.paymentForm.querySelector('.payment-info.card').classList.add('visible');
    this.paymentForm.querySelector('.payment-info.ideal').classList.remove('visible');
    this.paymentForm.querySelector('.payment-info.sepa_debit').classList.remove('visible');
    this.paymentForm.querySelector('.payment-info.wechat').classList.remove('visible');
    this.paymentForm.querySelector('.payment-info.redirect').classList.remove('visible');
    this.paymentForm.querySelector('.payment-info.au_becs_debit').classList.remove('visible');
  };

  // Shows a success message when the payment is complete
  orderComplete(paymentIntentId: string) {
    this.loading(false);
    /* document
      .querySelector(".result-message a")
      .setAttribute(
        "href",
        "https://dashboard.stripe.com/test/payments/" + paymentIntentId
      ); */
    this.showSuccesfullMessage = true;
    /* document.querySelector("button").disabled = true; */
    //let submitButton = document.getElementById('submit');
    //const submitButton = document.querySelector('button[type=submit]');
    this.submitButton.setAttribute('disabled', 'disabled');
  };

  // Show a spinner on payment submission
  loading(isLoading: boolean) {
    if (isLoading) {
      // Disable the button and show a spinner
      document.querySelector("button").disabled = true;
      document.querySelector("#spinner");
      const spinner = document.querySelector("#spinner");
      if (spinner) {
        spinner.classList.remove("hidden");
      }
      document.querySelector("#button-text").classList.add("hidden");
    } else {
      document.querySelector("button").disabled = false;
      const spinner = document.querySelector("#spinner");
      if (spinner) {
        spinner.classList.add("hidden");
      }
      const buttonText = document.querySelector("#button-text");
      if (buttonText) {
        buttonText.classList.remove("hidden");
      }
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

  // Handle new PaymentIntent result
  handlePayment(paymentResponse: any, user: User) {
    const {paymentIntent, error} = paymentResponse;

    //const mainElement = document.getElementById('main');
    const confirmationElement = document.getElementById('confirmation');
    
    //let submitButton = document.getElementById('submit');
    //const submitButton = document.querySelector('button[type=submit]');

    if (error && error.type === 'validation_error') {
      //mainElement.classList.remove('processing');
      //mainElement.classList.remove('receiver');
      (this.submitButton as any).disabled = false;
      this.submitButton.textContent = 'Complete Payment';
    } else if (error) {
      //mainElement.classList.remove('processing');
      //mainElement.classList.remove('receiver');
      (confirmationElement.querySelector('.error-message') as any).innerText =
        error.message;
      //mainElement.classList.add('error');
    } else if (paymentIntent.status === 'succeeded') {
      // Success! Payment is confirmed. Update the interface to display the confirmation screen.
      //mainElement.classList.remove('processing');
      //mainElement.classList.remove('receiver');
      // Update the note about receipt and shipping (the payment has been fully confirmed by the bank).
      (confirmationElement.querySelector('.note') as any).innerText =
        'We just sent your receipt to your email address, and your items will be on their way shortly.';
      //mainElement.classList.add('success');

      // Show a success message to your customer
      // There's a risk of the customer closing the window before callback
      // execution. Set up a webhook or plugin to listen for the
      // payment_intent.succeeded event that handles any business critical
      // post-payment actions.
      this.orderComplete(paymentResponse.paymentIntent.id);
      console.log('Payment succeded');
      console.log(paymentResponse);
      this.loading(false);
      setTimeout(() => {
        this.succesfullPurchase(user);
      }, 3000);
    } else if (paymentIntent.status === 'processing') {
      // Success! Now waiting for payment confirmation. Update the interface to display the confirmation screen.
      //mainElement.classList.remove('processing');
      // Update the note about receipt and shipping (the payment is not yet confirmed by the bank).
      (confirmationElement.querySelector('.note') as any).innerText =
        'We’ll send your receipt and ship your items as soon as your payment is confirmed.';
      //mainElement.classList.add('success');
    } else if (paymentIntent.status === 'requires_payment_method') {
      // Failure. Requires new PaymentMethod, show last payment error message.
      //mainElement.classList.remove('processing');
      (confirmationElement.querySelector('.error-message') as any).innerText =
        paymentIntent.last_payment_error || 'Payment failed';
      //mainElement.classList.add('error');
    } else {
      // Payment has failed.
      //mainElement.classList.remove('success');
      //mainElement.classList.remove('processing');
      //mainElement.classList.remove('receiver');
      //mainElement.classList.add('error');
    }
  };
}
