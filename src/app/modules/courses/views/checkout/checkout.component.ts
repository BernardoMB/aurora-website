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
  iframeDialogRef: MatDialogRef<IframeModalComponent>;
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
            // 19 because Verve cards are 19 digits
            if (16 <= cardNumber.length || cardNumber.length <= 19) {
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
    public coursesService: CoursesService,
    private authService: AuthService,
    private paymentsService: PaymentsService,
    private enterPinModal: MatDialog,
    private enterOtpModal: MatDialog,
    private enterBillingInfoModal: MatDialog,
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
    // Code for testing porpuses:
    //#region Case: (PIN and OTP)
    /* this.countryControl.setValue('NG');
    const courseIds = this.cart.map((course: Course) => course.id);
    const paymentInfo = {
      nameOnCard: 'Bernardo Mondragon',
      cardNumber: '5531886652142950',
      expiryMonth: '09',
      expiryYear: '22',
      securityCode: '564',
      rememberCard: true
    };
    this.purchaseCart(
      this.user.id,
      courseIds,
      this.paymentMethod,
      'MX', // TODO: should be iso format
      paymentInfo
    ); */
    //#endregion
    //#region Case: Visa Card (No auth)
    /* this.countryControl.setValue('NG');
    const courseIds = this.cart.map((course: Course) => course.id);
    const paymentInfo = {
      nameOnCard: 'Bernardo Mondragon',
      cardNumber: '4751763236699647',
      expiryMonth: '09',
      expiryYear: '21',
      rememberCard: true
    };
    this.purchaseCart(
      this.user.id,
      courseIds,
      this.paymentMethod,
      'MX', // TODO: should be iso format
      paymentInfo
    ); */
    //#endregion
    //#region Case: Verve Card (PIN)
    /* this.countryControl.setValue('NG');
    const courseIds = this.cart.map((course: Course) => course.id);
    const paymentInfo = {
      nameOnCard: 'Bernardo Mondragon',
      cardNumber: '5061460410120223210',
      expiryMonth: '12',
      expiryYear: '21',
      rememberCard: true
    };
    this.purchaseCart(
      this.user.id,
      courseIds,
      this.paymentMethod,
      'MX', // TODO: should be iso format
      paymentInfo
    ); */
    //#endregion
    //#region Case: Visa Card (Address Verification)
    this.countryControl.setValue('NG');
    const courseIds = this.cart.map((course: Course) => course.id);
    const paymentInfo = {
      nameOnCard: 'Bernardo Mondragon',
      cardNumber: '4556052704172643',
      expiryMonth: '01',
      expiryYear: '21',
      securityCode: '899',
      rememberCard: true
    };
    this.purchaseCart(
      this.user.id,
      courseIds,
      this.paymentMethod,
      'MX', // TODO: should be iso format
      paymentInfo
    );
    //#endregion
    // TODO: Implement 3DSercure cases

    // TODO: Uncomment code below for production
    /* if (this.paymentMethod === 'NEW_CARD') {
      if (this.newCardForm.valid && this.countryControl.valid) {
        console.log('TODO: Dispatch purchase user cart action');
        const courseIds = this.cart.map((course: Course) => course.id);
        this.purchaseCart(
          this.user.id,
          courseIds,
          this.paymentMethod,
          this.countryControl.value, // TODO: should be iso format
          {
            nameOnCard: this.newCardForm.get('nameOnCardControl').value.toString().trim(),
            cardNumber: this.newCardForm.get('cardNumberControl').value.toString().trim().replace(/\s/g, ''),
            expiryMonth: this.newCardForm.get('expiryMonthControl').value.toString().trim(),
            expiryYear: this.newCardForm.get('expiryYearControl').value.toString().trim().slice(-2),
            securityCode: this.newCardForm.get('securityCodeControl').value.toString().trim(),
            rememberCard: this.newCardForm.get('rememberCardControl').value
          }
        );
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
    } */
  }

  purchaseCart(userId: string, courses: string[], paymentMethod: string, country: string, paymentInfo: IPaymentInfo) {
    this.authService.purchaseCart(userId, courses, paymentMethod, country, paymentInfo).pipe(
      catchError((error) => {
        // Determine type of error (user Aurora API returned data)
        console.log('Chinga tu madre! Ocurrio un error: ', error);

        // Retry case 1
        if (error.error.error.status === 'success' && error.error.error.data.suggested_auth === 'PIN') {
          console.error('Retry request sending PIN');
          const enterPinDialogRef = this.enterPinModal.open(EnterPinModalComponent, this.dialogConfig);
          enterPinDialogRef.afterClosed().subscribe((pin: string) => {
            if (pin) {
              this.purchaseCart(userId, courses, paymentMethod, country, { ...paymentInfo, pin });
            }
          });
        }

        // Retry case 2
        if (error.error.error.status === 'success' && error.error.error.data.suggested_auth === 'NOAUTH_INTERNATIONAL') {
          console.error('Retry request sending Billing info');
          const enterbillingInfoDialogRef = this.enterBillingInfoModal.open(EnterBillingInfoModalComponent, this.dialogConfig);
          enterbillingInfoDialogRef.afterClosed().subscribe((billingInfo: IBillingInfo) => {
            if (billingInfo) {
              this.purchaseCart(userId, courses, paymentMethod, country, { ...paymentInfo, ...billingInfo, suggested_auth: 'NOAUTH_INTERNATIONAL' });
            }
          });
        }

        // Retry case 3
        if (error.error.error.status === 'success' && error.error.error.data.suggested_auth === 'AVS_VBVSECURECODE') {
          console.error('Retry request sending Billing info');
          const enterbillingInfoDialogRef = this.enterBillingInfoModal.open(EnterBillingInfoModalComponent, this.dialogConfig);
          enterbillingInfoDialogRef.afterClosed().subscribe((billingInfo: IBillingInfo) => {
            if (billingInfo) {
              this.purchaseCart(userId, courses, paymentMethod, country, { ...paymentInfo, ...billingInfo, suggested_auth: 'NOAUTH_INTERNATIONAL' });
            }
          });
        }

        // Proceed with validation Scenario 1 (Validate sending OTP)
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
                  this.toastrService.success('Could not validate your payment');
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

        // Proceed with validation Scenario 2 (Validate entering OTP in iframe)
        if (error.error.error.status === 'success' && error.error.error.data.authModelUsed === 'VBVSECURECODE') {
          console.error('Validate payment by oppening iframe');
          // TODO: Open instanciate socket connection to transaction's room
          // TODO: Open iframe
          /* console.log('Error data', error.error.error.data); */
          const dialogConfig = {
            ...(this.dialogConfig),
            data: error.error.error.data.authurl
          };
          this.iframeDialogRef = this.enterOtpModal.open(IframeModalComponent, dialogConfig);
        }

        throw error;
      })
    ).subscribe((user: User) => {
      console.log('No error response', user);
      if (user.cart.length === 0) {
        this.succesfullPurchase(user);
      }
    });
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
  succesfullPurchase(user: User) {
    this.toastrService.success('Successful purchase.', 'Enjoy!');
    this.store.dispatch(purchaseCartSuccess(user));
    this.router.navigate(['courses/my-courses']);
  }

}
