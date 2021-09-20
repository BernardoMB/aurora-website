import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, throwError } from 'rxjs';
import { Course } from '../../../../shared/models/course.model';
import { Store, select } from '@ngrx/store';
import { AuthState } from '../../../../store/auth/auth.state';
import { selectAuthCart, selectAuthIsAuthenticated, selectAuthUser } from '../../../../store/auth/auth.selectors';
import { Router, ActivatedRoute } from '@angular/router';
import { removeCourseFromCart, purchaseCartSuccess } from '../../../../store/auth/auth.actions';
import { User } from '../../../../shared/models/user.model';
import { CoursesService } from '../../services/courses.service';
import { MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { take, catchError } from 'rxjs/operators';
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
  matcher;
  showProgressSpinner = false;
  iframeDialogRef: MatDialogRef<IframeModalComponent>;
  socketConnection;
  connectionId;
  host = environment.host;
  apiVersion = environment.apiVersion;
  routeDataSubscription: Subscription;
  isAuthenticatedSubscription: Subscription;
  isAuthenticated: boolean;
  availableBanks;
  userSubscription: Subscription;
  user: User;
  userCards; // TODO: Specify type
  cartSubscription: Subscription;
  cart: Course[];
  dialogConfig = new MatDialogConfig();
  paymentMethod = 'NEW_CARD'; // Default payment method
  showBankPaymentForm = false;
  showNewCardPaymentForm = true;
  expirationYears: number[];
  rememberCard = true;
  selectedUserCard;
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

  countryControl = new FormControl('NG', [Validators.required]);
  newCardForm = new FormGroup({
    nameOnCardControl: new FormControl('', [Validators.required]),
    cardNumberControl: new FormControl('', [
      Validators.required,
      (control: AbstractControl): {[key: string]: any} | null => {
        let isValid = false;
        if (control.value) {
          const cardNumber = control.value.toString().trim().replace(/\s/g, '');
          console.log('Card number', cardNumber);
          if (cardNumber) {
            // 19 because Verve cards are 19 digits
            if (15 <= cardNumber.length && cardNumber.length <= 19) {
              console.log(`${cardNumber.length} is valid :\)`);
              isValid = true;
              console.log('Returning null');
              return null;
            } else {
              console.log(`${cardNumber.length} is not valid!`);
              isValid = false;
              console.log('Returning error');
              return { notAValidCardNumber: {value: control.value}};
            }
          }
        }
      }
    ]),
    expiryMonthControl: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]),
    expiryYearControl: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]),
    securityCodeControl: new FormControl('', [
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
    // ? Overall form validation needed?
    validators: (control: FormGroup): ValidationErrors | null => {
      // control is the form group
      const isValid = true;
      return isValid ? null : { anyValue: true };
    }
  } */);

  // TODO: Setup bank account payments
  bankAccountForm = new FormGroup({
    accountBankControl: new FormControl('', [Validators.required]),
    accountNumbercontrol: new FormControl('', [Validators.required]),
    bvnControl: new FormControl('', [Validators.required]),
    passcodeControl: new FormControl(''),
    firstNameControl: new FormControl('', [Validators.required]),
    lastNameControl: new FormControl('', [Validators.required])
  }, /* {
    // ? Overall form validation needed?
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
    public coursesService: CoursesService,
    private authService: AuthService,
    private paymentsService: PaymentsService,
    private enterPinModal: MatDialog,
    private enterOtpModal: MatDialog,
    private enterBillingInfoModal: MatDialog,
    private paymentErrorModal: MatDialog,
    private iframeModal: MatDialog,
    private toastrService: ToastrService
  ) {
    // Define set of expiration years
    this.expirationYears = [];
    const date = new Date();
    const currentYear = date.getFullYear();
    for (let i = 0; i <= 20; i++) {
      this.expirationYears.push(currentYear + i);
    }
    // Define dialogs configuration
    this.dialogConfig.autoFocus = true;
    this.dialogConfig.panelClass = 'custom-mat-dialog-container';
    this.dialogConfig.backdropClass = 'custom-modal-backdrop';
    this.dialogConfig.maxHeight = '80vh';
    // Form errors
    this.matcher = new MyErrorStateMatcher();
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
  onCompletePaymentTest() {
    this.socketConnection = io(`${this.host}`);
    this.socketConnection.on('connect', () => {
      this.connectionId = this.socketConnection.id;
      this.showProgressSpinner = true;

      // ! Testcards
      //#region ardsard 1: Test MasterCard PIN authentication
      // PIN (3310) modal, OTP (12345) modal // * Success
      this.countryControl.setValue('NG');
      const courseIds = this.cart.map((course: Course) => course.id);
      const paymentInfo = {
        nameOnCard: 'Bernardo Mondragon',
        cardNumber: '5531886652142950',
        expiryMonth: '09',
        expiryYear: '22',
        securityCode: '564',
        rememberCard: true,
        redirect_url: `${this.host}/${this.apiVersion}/payments/validate/3dsecure?connectionid=${this.connectionId}`
      };
      this.purchaseCart(
        this.user.id,
        courseIds,
        this.paymentMethod,
        'NG',
        paymentInfo,
      );
      //#endregion
      //#region Test card 2: Test Visa Card 3D-Secure authentication
      // OTP iframe // * Success
      /* this.countryControl.setValue('NG');
      const courseIds = this.cart.map((course: Course) => course.id);
      const paymentInfo = {
        nameOnCard: 'Bernardo Mondragon',
        cardNumber: '4187427415564246',
        expiryMonth: '09',
        expiryYear: '21',
        securityCode: '828',
        rememberCard: true,
        redirect_url: `${this.host}/${this.apiVersion}/payments/validate/3dsecure?connectionid=${this.connectionId}`
      };
      this.purchaseCart(
        this.user.id,
        courseIds,
        this.paymentMethod,
        'NG',
        paymentInfo
      ); */
      //#endregion
      //#region Test card 3: Test MasterCard 3DSecure authentication
      // OTP iframe // * Success
      /* this.countryControl.setValue('NG');
      const courseIds = this.cart.map((course: Course) => course.id);
      const paymentInfo = {
        nameOnCard: 'Bernardo Mondragon',
        cardNumber: '5438898014560229',
        expiryMonth: '10',
        expiryYear: '20',
        securityCode: '564',
        rememberCard: true,
        redirect_url: `${this.host}/${this.apiVersion}/payments/validate/3dsecure?connectionid=${this.connectionId}`
      };
      this.purchaseCart(
        this.user.id,
        courseIds,
        this.paymentMethod,
        'NG',
        paymentInfo
      ); */
      //#endregion
      //#region Test card 4: Test Mastercard 3DSecure authentication 2
      // PIN modal and OTP modal // * Success
      /* this.countryControl.setValue('NG');
      const courseIds = this.cart.map((course: Course) => course.id);
      const paymentInfo = {
        nameOnCard: 'Bernardo Mondragon',
        cardNumber: '5399838383838381',
        expiryMonth: '10',
        expiryYear: '22',
        securityCode: '470',
        rememberCard: true,
        redirect_url: `${this.host}/${this.apiVersion}/payments/validate/3dsecure?connectionid=${this.connectionId}`
      };
      this.purchaseCart(
        this.user.id,
        courseIds,
        this.paymentMethod,
        'NG',
        paymentInfo
      ); */
      //#endregion
      //#region Test card 5: Test NoAuth Visa Card
      // No user prompt // * Success
      /* this.countryControl.setValue('NG');
      const courseIds = this.cart.map((course: Course) => course.id);
      const paymentInfo = {
        nameOnCard: 'Bernardo Mondragon',
        cardNumber: '4751763236699647',
        expiryMonth: '09',
        expiryYear: '21',
        rememberCard: true,
        redirect_url: `${this.host}/${this.apiVersion}/payments/validate/3dsecure?connectionid=${this.connectionId}`
      };
      this.purchaseCart(
        this.user.id,
        courseIds,
        this.paymentMethod,
        'NG',
        paymentInfo
      ); */
      //#endregion
      //#region Test card 6: Test VisaCard 3D-Secure Authentication
      // OTP iframe // * Success
      /* this.countryControl.setValue('NG');
      const courseIds = this.cart.map((course: Course) => course.id);
      const paymentInfo = {
        nameOnCard: 'Bernardo Mondragon',
        cardNumber: '4242424242424242',
        expiryMonth: '01',
        expiryYear: '21',
        securityCode: '812',
        rememberCard: true,
        redirect_url: `${this.host}/${this.apiVersion}/payments/validate/3dsecure?connectionid=${this.connectionId}`
      };
      this.purchaseCart(
        this.user.id,
        courseIds,
        this.paymentMethod,
        'NG',
        paymentInfo
      ); */
      //#endregion
      //#region Test card 7: Test Verve Card (PIN)
      // PIN modal, OTP modal // * Success
      /* this.countryControl.setValue('NG');
      const courseIds = this.cart.map((course: Course) => course.id);
      const paymentInfo = {
        nameOnCard: 'Bernardo Mondragon',
        cardNumber: '5061460410120223210',
        expiryMonth: '12',
        expiryYear: '21',
        securityCode: '780',
        rememberCard: true,
        redirect_url: `${this.host}/${this.apiVersion}/payments/validate/3dsecure?connectionid=${this.connectionId}`
      };
      this.purchaseCart(
        this.user.id,
        courseIds,
        this.paymentMethod,
        'NG',
        paymentInfo
      ); */
      //#endregion
      //#region Test card 8: Test VisaCard (Address Verification)
      // Billing modal, OTP iframe // * Success
      /* this.countryControl.setValue('NG');
      const courseIds = this.cart.map((course: Course) => course.id);
      const paymentInfo = {
        nameOnCard: 'Bernardo Mondragon',
        cardNumber: '4556052704172643',
        expiryMonth: '01',
        expiryYear: '21',
        securityCode: '899',
        rememberCard: true,
        redirect_url: `${this.host}/${this.apiVersion}/payments/validate/3dsecure?connectionid=${this.connectionId}`
      };
      this.purchaseCart(
        this.user.id,
        courseIds,
        this.paymentMethod,
        'NG',
        paymentInfo
      ); */
      //#endregion
      //#region Test card 9: Test card Declined (Address Verification)
      // Billing modal, Rave error response // ! Should fail
      /* this.countryControl.setValue('NG');
      const courseIds = this.cart.map((course: Course) => course.id);
      const paymentInfo = {
        nameOnCard: 'Bernardo Mondragon',
        cardNumber: '5143010522339965',
        expiryMonth: '08',
        expiryYear: '21',
        securityCode: '276',
        rememberCard: true,
        redirect_url: `${this.host}/${this.apiVersion}/payments/validate/3dsecure?connectionid=${this.connectionId}`
      };
      this.purchaseCart(
        this.user.id,
        courseIds,
        this.paymentMethod,
        'NG',
        paymentInfo
      ); */
      //#endregion
      //#region Text card 10: Test Card Fraudulent
      // Billing modal, Rave error response // ! Should fail
      /* this.countryControl.setValue('NG');
      const courseIds = this.cart.map((course: Course) => course.id);
      const paymentInfo = {
        nameOnCard: 'Bernardo Mondragon',
        cardNumber: '5590131743294314',
        expiryMonth: '11',
        expiryYear: '20',
        securityCode: '887',
        rememberCard: true,
        redirect_url: `${this.host}/${this.apiVersion}/payments/validate/3dsecure?connectionid=${this.connectionId}`
      };
      this.purchaseCart(
        this.user.id,
        courseIds,
        this.paymentMethod,
        'NG',
        paymentInfo
      ); */
      //#endregion
      //#region Text card 11: Test Card Insufficient Funds
      // Insuficient funds error // ! Should fail
      /* this.countryControl.setValue('NG');
      const courseIds = this.cart.map((course: Course) => course.id);
      const paymentInfo = {
        nameOnCard: 'Bernardo Mondragon',
        cardNumber: '5258585922666506',
        expiryMonth: '09',
        expiryYear: '21',
        securityCode: '883',
        rememberCard: true,
        redirect_url: `${this.host}/${this.apiVersion}/payments/validate/3dsecure?connectionid=${this.connectionId}`
      };
      this.purchaseCart(
        this.user.id,
        courseIds,
        this.paymentMethod,
        'NG',
        paymentInfo
      ); */
      //#endregion
      //#region Text card 12: Pre-authorization Test Card
      // Preauthorization iframe, Rave error notification // ! Should fail
      /* this.countryControl.setValue('NG');
      const courseIds = this.cart.map((course: Course) => course.id);
      const paymentInfo = {
        nameOnCard: 'Bernardo Mondragon',
        cardNumber: '5377283645077450',
        expiryMonth: '09',
        expiryYear: '21',
        securityCode: '789',
        rememberCard: true,
        redirect_url: `${this.host}/${this.apiVersion}/payments/validate/3dsecure?connectionid=${this.connectionId}`
      };
      this.purchaseCart(
        this.user.id,
        courseIds,
        this.paymentMethod,
        'NG',
        paymentInfo
      ); */
      //#endregion
      //#region Text card 13: Test card - Do Not Honour
      // Billing modal, Rave error response // ! Should fail
      /* this.countryControl.setValue('NG');
      const courseIds = this.cart.map((course: Course) => course.id);
      const paymentInfo = {
        nameOnCard: 'Bernardo Mondragon',
        cardNumber: '5143010522339965',
        expiryMonth: '08',
        expiryYear: '21',
        securityCode: '276',
        rememberCard: true,
        redirect_url: `${this.host}/${this.apiVersion}/payments/validate/3dsecure?connectionid=${this.connectionId}`
      };
      this.purchaseCart(
        this.user.id,
        courseIds,
        this.paymentMethod,
        'NG',
        paymentInfo
      ); */
      //#endregion
      //#region Text card 14: Test Card - Insufficient Funds
      // Insuficient funds error // ! Should fail
      /* this.countryControl.setValue('NG');
      const courseIds = this.cart.map((course: Course) => course.id);
      const paymentInfo = {
        nameOnCard: 'Bernardo Mondragon',
        cardNumber: '5258585922666506',
        expiryMonth: '09',
        expiryYear: '21',
        securityCode: '883',
        rememberCard: true,
        redirect_url: `${this.host}/${this.apiVersion}/payments/validate/3dsecure?connectionid=${this.connectionId}`
      };
      this.purchaseCart(
        this.user.id,
        courseIds,
        this.paymentMethod,
        'NG',
        paymentInfo
      ); */
      //#endregion
      //#region Text card 15: Test Card - Invalid Transaction
      // OTP iframe, Rave error notification // ! Should fail
      /* this.countryControl.setValue('NG');
      const courseIds = this.cart.map((course: Course) => course.id);
      const paymentInfo = {
        nameOnCard: 'Bernardo Mondragon',
        cardNumber: '5551658157653822',
        expiryMonth: '08',
        expiryYear: '21',
        securityCode: '276',
        rememberCard: true,
        redirect_url: `${this.host}/${this.apiVersion}/payments/validate/3dsecure?connectionid=${this.connectionId}`
      };
      this.purchaseCart(
        this.user.id,
        courseIds,
        this.paymentMethod,
        'NG',
        paymentInfo
      ); */
      //#endregion
      //#region Text card 16: Test Card - Restricted Card, Retain Card
      // OTP iframe, Rave error notification // ! Should fail
      /* this.countryControl.setValue('NG');
      const courseIds = this.cart.map((course: Course) => course.id);
      const paymentInfo = {
        nameOnCard: 'Bernardo Mondragon',
        cardNumber: '5551651630381384',
        expiryMonth: '08',
        expiryYear: '21',
        securityCode: '276',
        rememberCard: true,
        redirect_url: `${this.host}/${this.apiVersion}/payments/validate/3dsecure?connectionid=${this.connectionId}`
      };
      this.purchaseCart(
        this.user.id,
        courseIds,
        this.paymentMethod,
        'NG',
        paymentInfo
      ); */
      //#endregion
      //#region Text card 17: Test Card - Function Not Permitted to Cardholder
      // OTP iframe Rave error notification // ! Should fail
      /* this.countryControl.setValue('NG');
      const courseIds = this.cart.map((course: Course) => course.id);
      const paymentInfo = {
        nameOnCard: 'Bernardo Mondragon',
        cardNumber: '5258582054729020',
        expiryMonth: '11',
        expiryYear: '20',
        securityCode: '887',
        rememberCard: true,
        redirect_url: `${this.host}/${this.apiVersion}/payments/validate/3dsecure?connectionid=${this.connectionId}`
      };
      this.purchaseCart(
        this.user.id,
        courseIds,
        this.paymentMethod,
        'NG',
        paymentInfo
      ); */
      //#endregion
      //#region Text card 18: Test Card - Function Not Permitted to Terminal
      // OTP iframe, Rave error notification // ! Should fail
      /* this.countryControl.setValue('NG');
      const courseIds = this.cart.map((course: Course) => course.id);
      const paymentInfo = {
        nameOnCard: 'Bernardo Mondragon',
        cardNumber: '5258588264565682',
        expiryMonth: '11',
        expiryYear: '20',
        securityCode: '887',
        rememberCard: true,
        redirect_url: `${this.host}/${this.apiVersion}/payments/validate/3dsecure?connectionid=${this.connectionId}`
      };
      this.purchaseCart(
        this.user.id,
        courseIds,
        this.paymentMethod,
        'NG',
        paymentInfo
      ); */
      //#endregion
      //#region Text card 20: Test Card - Transaction Error
      // OTP iframe, Rave error notification // ! Should fail
      /* this.countryControl.setValue('NG');
      const courseIds = this.cart.map((course: Course) => course.id);
      const paymentInfo = {
        nameOnCard: 'Bernardo Mondragon',
        cardNumber: '5258589130149016',
        expiryMonth: '11',
        expiryYear: '20',
        securityCode: '887',
        rememberCard: true,
        redirect_url: `${this.host}/${this.apiVersion}/payments/validate/3dsecure?connectionid=${this.connectionId}`
      };
      this.purchaseCart(
        this.user.id,
        courseIds,
        this.paymentMethod,
        'NG',
        paymentInfo
      ); */
      //#endregion
      //#region Text card 21: Test Card - Incorrect PIN
      // PIN modal, Rave error response // ! Should fail
      /* this.countryControl.setValue('NG');
      const courseIds = this.cart.map((course: Course) => course.id);
      const paymentInfo = {
        nameOnCard: 'Bernardo Mondragon',
        cardNumber: '5399834697894723',
        expiryMonth: '09',
        expiryYear: '21',
        securityCode: '883',
        rememberCard: true,
        redirect_url: `${this.host}/${this.apiVersion}/payments/validate/3dsecure?connectionid=${this.connectionId}`
      };
      this.purchaseCart(
        this.user.id,
        courseIds,
        this.paymentMethod,
        'NG',
        paymentInfo
      ); */
      //#endregion
      //#region Text card 22: Test Verve Card - Card enrolment
      // PIN modal, Rave error response // * Success
      /* this.countryControl.setValue('NG');
      const courseIds = this.cart.map((course: Course) => course.id);
      const paymentInfo = {
        nameOnCard: 'Bernardo Mondragon',
        cardNumber: '5531882884804517',
        expiryMonth: '10',
        expiryYear: '22',
        securityCode: '564',
        rememberCard: true,
        redirect_url: `${this.host}/${this.apiVersion}/payments/validate/3dsecure?connectionid=${this.connectionId}`
      };
      this.purchaseCart(
        this.user.id,
        courseIds,
        this.paymentMethod,
        'NG',
        paymentInfo
      ); */
      //#endregion

    });
    this.socketConnection.on('payment_success', () => {
      this.iframeDialogRef.close();
      this.user.cart = [];
      this.succesfullPurchase(this.user);
      this.socketConnection.disconnect();
      this.showProgressSpinner = false;
    });
    this.socketConnection.on('payment_failure', (message) => {
      this.iframeDialogRef.close();
      const dialogConfig = {
        ...(this.dialogConfig),
        data: {
          errorMessage: message
        }
      };
      this.paymentErrorModal.open(PaymentErrorModalComponent, dialogConfig);
      this.socketConnection.disconnect();
      this.showProgressSpinner = false;
    });
  }

  /**
   * Function called when user hits complete payment button.
   * Use this approach for production environment
   *
   * @memberof CheckoutComponent
   */
  onCompletePayment() {
    this.countryControl.markAsTouched();
    this.newCardForm.markAsTouched();
    this.newCardForm.controls.nameOnCardControl.markAsTouched();
    this.newCardForm.controls.cardNumberControl.markAsTouched();
    this.newCardForm.controls.expiryMonthControl.markAsTouched();
    this.newCardForm.controls.expiryYearControl.markAsTouched();
    this.newCardForm.controls.securityCodeControl.markAsTouched();
    // * Real case obtain data from form
    if (this.paymentMethod === 'NEW_CARD') {
      if (this.newCardForm.valid && this.countryControl.valid) {
        const courseIds = this.cart.map((course: Course) => course.id);
        this.socketConnection = io(`${this.host}`);
        this.socketConnection.on('connect', () => {
          this.connectionId = this.socketConnection.id;
          this.showProgressSpinner = true;
          // this.purchaseCart(
          //   this.user.id,
          //   courseIds,
          //   this.paymentMethod,
          //   this.countryControl.value,
          //   {
          //     nameOnCard: this.newCardForm.get('nameOnCardControl').value.toString().trim(),
          //     cardNumber: this.newCardForm.get('cardNumberControl').value.toString().trim().replace(/\s/g, ''),
          //     expiryMonth: this.newCardForm.get('expiryMonthControl').value.toString().trim(),
          //     expiryYear: this.newCardForm.get('expiryYearControl').value.toString().trim().slice(-2),
          //     securityCode: this.newCardForm.get('securityCodeControl').value.toString().trim(),
          //     rememberCard: this.newCardForm.get('rememberCardControl').value ? true : false,
          //     redirect_url: `${this.host}/${this.apiVersion}/payments/validate/3dsecure?connectionid=${this.connectionId}`
          //   }
          // );
          this.purchaseCart2(
            this.user.id,
            courseIds,
            this.paymentMethod,
            this.countryControl.value,
            {
              nameOnCard: this.newCardForm.get('nameOnCardControl').value.toString().trim(),
              cardNumber: this.newCardForm.get('cardNumberControl').value.toString().trim().replace(/\s/g, ''),
              expiryMonth: this.newCardForm.get('expiryMonthControl').value.toString().trim(),
              expiryYear: this.newCardForm.get('expiryYearControl').value.toString().trim().slice(-2),
              securityCode: this.newCardForm.get('securityCodeControl').value.toString().trim(),
              rememberCard: this.newCardForm.get('rememberCardControl').value ? true : false,
              redirect_url: `${this.host}/${this.apiVersion}/payments/validate/3dsecure?connectionid=${this.connectionId}`
            }
          );
        });
        this.socketConnection.on('payment_success', () => {
          this.iframeDialogRef.close();
          this.user.cart = [];
          this.succesfullPurchase(this.user);
          this.socketConnection.disconnect();
          this.showProgressSpinner = false;
        });
        this.socketConnection.on('payment_failure', (message) => {
          this.iframeDialogRef.close();
          const dialogConfig = {
            ...(this.dialogConfig),
            data: {
              errorMessage: message
            }
          };
          this.paymentErrorModal.open(PaymentErrorModalComponent, dialogConfig);
          this.socketConnection.disconnect();
          this.showProgressSpinner = false;
        });
      } else {
        alert('Invalid payment data. Please review payment form');
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

  purchaseCart(userId: string, courses: string[], paymentMethod: string, country: string, paymentInfo: IPaymentInfo) {
    console.log('CheckoutComponent: purchaseCart function called');
    this.authService.purchaseCart(userId, courses, paymentMethod, country, paymentInfo).pipe(
      catchError((error) => {
        // Determine type of error (use Aurora API returned data):
        console.error('Chinga tu madre! Ocurrio un error.', error);

        //#region Card requires PIN authentication
        if (error.error.error.status === 'success' && error.error.error.data.suggested_auth === 'PIN') {
          console.error('Retry request sending PIN');
          const enterPinDialogRef = this.enterPinModal.open(EnterPinModalComponent, this.dialogConfig);
          enterPinDialogRef.afterClosed().subscribe((pin: string) => {
            if (pin && pin.length >= 3) {
              console.log('Pin was entered. Purchasing cart');
              this.purchaseCart(userId, courses, paymentMethod, country, { ...paymentInfo, pin });
            }
          });
        }
        //#endregion
        //#region Card requires sending billing info (NOAUTH_INTERNATIONAL method)
        if (error.error.error.status === 'success' && error.error.error.data.suggested_auth === 'NOAUTH_INTERNATIONAL') {
          console.error('Retry request sending Billing info');
          const enterbillingInfoDialogRef = this.enterBillingInfoModal.open(EnterBillingInfoModalComponent, this.dialogConfig);
          enterbillingInfoDialogRef.afterClosed().subscribe((billingInfo: IBillingInfo) => {
            if (billingInfo) {
              const redirectUrl = `${this.host}/${this.apiVersion}/payments/validate/3dsecure?connectionid=${this.connectionId}`;
              console.log('Billing info was entered. Purchasing cart');
              this.purchaseCart(userId, courses, paymentMethod, country, { ...paymentInfo, ...billingInfo, suggested_auth: 'NOAUTH_INTERNATIONAL', redirect_url: redirectUrl });
            }
          });
        }
        //#endregion
        //#region Card requires sending billing info (AVS_VBVSECURECODE method)
        if (error.error.error.status === 'success' && error.error.error.data.suggested_auth === 'AVS_VBVSECURECODE') {
          console.error('Retry request sending Billing info');
          const enterbillingInfoDialogRef = this.enterBillingInfoModal.open(EnterBillingInfoModalComponent, this.dialogConfig);
          enterbillingInfoDialogRef.afterClosed().subscribe((billingInfo: IBillingInfo) => {
            if (billingInfo) {
              const redirectUrl = `${this.host}/${this.apiVersion}/payments/validate/3dsecure?connectionid=${this.connectionId}`;
              console.log('Billing info was entered. Purchasing cart');
              this.purchaseCart(userId, courses, paymentMethod, country, { ...paymentInfo, ...billingInfo, suggested_auth: 'AVS_VBVSECURECODE', redirect_url: redirectUrl });
            }
          });
        }
        //#endregion

        //#region Card requires OTP validation
        if (error.error.error.status === 'success' && error.error.error.data.authModelUsed === 'PIN') {
          const transactionReference = error.error.error.data.flwRef;
          const internalTransactionReference = error.error.error.data.txRef;
          const enterOtpDialogRef = this.enterOtpModal.open(EnterOtpModalComponent, this.dialogConfig);
          enterOtpDialogRef.afterClosed().subscribe((otp: string) => {
            if (otp) {
              const validatePaymentDto: ValidatePaymentDto = {
                transactionReference,
                internalTransactionReference,
                otp
              };
              this.paymentsService.validatePayment(validatePaymentDto).pipe(
                catchError((validatePaymentError) => {
                  console.log('Validate payment error', validatePaymentError);
                  this.toastrService.error('Could not validate your payment');
                  this.showProgressSpinner = false;
                  throw validatePaymentError;
                })
              ).subscribe((user: User) => {
                console.log('Validate payment response', user);
                if (user.cart.length === 0) {
                  this.succesfullPurchase(user);
                }
              });
            }
          });
        }
        //#endregion
        //#region Card requires 3DSecure validation
        if (error.error.error.status === 'success' && error.error.error.data.authModelUsed === 'VBVSECURECODE') {
          const dialogConfig = {
            ...(this.dialogConfig),
            data: error.error.error.data.authurl
          };
          this.iframeDialogRef = this.iframeModal.open(IframeModalComponent, dialogConfig);
        }
        //#endregion

        //#region Handling Rave error response
        if (error.error.error.status === 'error' && error.error.error.message === 'Incorrect PIN') {
          console.error('Retry request sending PIN');
          this.toastrService.error('Enter PIN again', 'Incorrect PIN');
          const enterPinDialogRef = this.enterPinModal.open(EnterPinModalComponent, this.dialogConfig);
          enterPinDialogRef.afterClosed().subscribe((pin: string) => {
            if (pin && pin.length >= 3) {
              console.log('Pin was entered. Purchasing cart');
              this.purchaseCart(userId, courses, paymentMethod, country, { ...paymentInfo, pin });
            }
          });
        } else if (error.error.error.status === 'error' && (error.error.error.data.code === 'FLW_ERR' || error.error.error.data.code === 'CARD_ERR')) {
          this.toastrService.error('Payment error');
          this.socketConnection.disconnect();
          const dialogConfig = {
            ...(this.dialogConfig),
            data: {
              errorMessage: error.error.error.data.message
            }
          };
          this.paymentErrorModal.open(PaymentErrorModalComponent, dialogConfig);
          this.showProgressSpinner = false;
        }
        //#endregion

        throw error;
      })
    ).subscribe((user: User) => {
      console.log('No error response', user);
      if (user.cart.length === 0) {
        this.succesfullPurchase(user);
      }
    });
  }

  purchaseCart2(userId: string, courses: string[], paymentMethod: string, country: string, paymentInfo: IPaymentInfo) {
    console.log('CheckoutComponent: purchaseCart2 function called');
    this.authService.purchaseCart2(userId, courses, paymentMethod, country).pipe(
      catchError((error) => {
        // Determine type of error (use Aurora API returned data):
        console.error('Chinga tu madre! Ocurrio un error.', error);

        //#region Card requires PIN authentication
        if (error.error.error.status === 'success' && error.error.error.data.suggested_auth === 'PIN') {
          console.error('Retry request sending PIN');
          const enterPinDialogRef = this.enterPinModal.open(EnterPinModalComponent, this.dialogConfig);
          enterPinDialogRef.afterClosed().subscribe((pin: string) => {
            if (pin && pin.length >= 3) {
              console.log('Pin was entered. Purchasing cart');
              this.purchaseCart(userId, courses, paymentMethod, country, { ...paymentInfo, pin });
            }
          });
        }
        //#endregion
        //#region Card requires sending billing info (NOAUTH_INTERNATIONAL method)
        if (error.error.error.status === 'success' && error.error.error.data.suggested_auth === 'NOAUTH_INTERNATIONAL') {
          console.error('Retry request sending Billing info');
          const enterbillingInfoDialogRef = this.enterBillingInfoModal.open(EnterBillingInfoModalComponent, this.dialogConfig);
          enterbillingInfoDialogRef.afterClosed().subscribe((billingInfo: IBillingInfo) => {
            if (billingInfo) {
              const redirectUrl = `${this.host}/${this.apiVersion}/payments/validate/3dsecure?connectionid=${this.connectionId}`;
              console.log('Billing info was entered. Purchasing cart');
              this.purchaseCart(userId, courses, paymentMethod, country, { ...paymentInfo, ...billingInfo, suggested_auth: 'NOAUTH_INTERNATIONAL', redirect_url: redirectUrl });
            }
          });
        }
        //#endregion
        //#region Card requires sending billing info (AVS_VBVSECURECODE method)
        if (error.error.error.status === 'success' && error.error.error.data.suggested_auth === 'AVS_VBVSECURECODE') {
          console.error('Retry request sending Billing info');
          const enterbillingInfoDialogRef = this.enterBillingInfoModal.open(EnterBillingInfoModalComponent, this.dialogConfig);
          enterbillingInfoDialogRef.afterClosed().subscribe((billingInfo: IBillingInfo) => {
            if (billingInfo) {
              const redirectUrl = `${this.host}/${this.apiVersion}/payments/validate/3dsecure?connectionid=${this.connectionId}`;
              console.log('Billing info was entered. Purchasing cart');
              this.purchaseCart(userId, courses, paymentMethod, country, { ...paymentInfo, ...billingInfo, suggested_auth: 'AVS_VBVSECURECODE', redirect_url: redirectUrl });
            }
          });
        }
        //#endregion

        //#region Card requires OTP validation
        if (error.error.error.status === 'success' && error.error.error.data.authModelUsed === 'PIN') {
          const transactionReference = error.error.error.data.flwRef;
          const internalTransactionReference = error.error.error.data.txRef;
          const enterOtpDialogRef = this.enterOtpModal.open(EnterOtpModalComponent, this.dialogConfig);
          enterOtpDialogRef.afterClosed().subscribe((otp: string) => {
            if (otp) {
              const validatePaymentDto: ValidatePaymentDto = {
                transactionReference,
                internalTransactionReference,
                otp
              };
              this.paymentsService.validatePayment(validatePaymentDto).pipe(
                catchError((validatePaymentError) => {
                  console.log('Validate payment error', validatePaymentError);
                  this.toastrService.error('Could not validate your payment');
                  this.showProgressSpinner = false;
                  throw validatePaymentError;
                })
              ).subscribe((user: User) => {
                console.log('Validate payment response', user);
                if (user.cart.length === 0) {
                  this.succesfullPurchase(user);
                }
              });
            }
          });
        }
        //#endregion
        //#region Card requires 3DSecure validation
        if (error.error.error.status === 'success' && error.error.error.data.authModelUsed === 'VBVSECURECODE') {
          const dialogConfig = {
            ...(this.dialogConfig),
            data: error.error.error.data.authurl
          };
          this.iframeDialogRef = this.iframeModal.open(IframeModalComponent, dialogConfig);
        }
        //#endregion

        //#region Handling Rave error response
        if (error.error.error.status === 'error' && error.error.error.message === 'Incorrect PIN') {
          console.error('Retry request sending PIN');
          this.toastrService.error('Enter PIN again', 'Incorrect PIN');
          const enterPinDialogRef = this.enterPinModal.open(EnterPinModalComponent, this.dialogConfig);
          enterPinDialogRef.afterClosed().subscribe((pin: string) => {
            if (pin && pin.length >= 3) {
              console.log('Pin was entered. Purchasing cart');
              this.purchaseCart(userId, courses, paymentMethod, country, { ...paymentInfo, pin });
            }
          });
        } else if (error.error.error.status === 'error' && (error.error.error.data.code === 'FLW_ERR' || error.error.error.data.code === 'CARD_ERR')) {
          this.toastrService.error('Payment error');
          this.socketConnection.disconnect();
          const dialogConfig = {
            ...(this.dialogConfig),
            data: {
              errorMessage: error.error.error.data.message
            }
          };
          this.paymentErrorModal.open(PaymentErrorModalComponent, dialogConfig);
          this.showProgressSpinner = false;
        }
        //#endregion

        throw error;
      })
    ).subscribe((res: { user: User, paymentIntentClientSecret: string }) => {
      if (res.user.cart.length === 0) {
        this.succesfullPurchase(res.user);
      } else {
        const { paymentIntentClientSecret } = res;
        console.log({res});
      }
    });
  }

  succesfullPurchase(user: User) {
    this.toastrService.success('Successful purchase.', 'Enjoy!');
    this.store.dispatch(purchaseCartSuccess(user));
    this.router.navigate(['courses/my-courses']);
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

  // * Utility functions

  pene() {
    console.log('Control', this.countryControl);
    console.log('Form valid', this.newCardForm.valid);
    console.log(this.newCardForm);
  }

}
