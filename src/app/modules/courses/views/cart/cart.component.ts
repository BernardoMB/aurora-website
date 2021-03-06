import { Component, OnInit, OnDestroy } from '@angular/core';
import { State } from '../../../../store/state';
import { Store, select } from '@ngrx/store';
import { Subscription } from 'rxjs';
import {
  selectAuthCart,
  selectAuthState,
} from '../../../../store/auth/auth.selectors';
import { Course } from '../../../../shared/models/course.model';
import { User } from '../../../../shared/models/user.model';
import { AuthState } from '../../../../store/auth/auth.state';
import { CookieService } from 'ngx-cookie-service';
import {
  pullCourseFromCarts,
  removeCourseFromCart,
} from '../../../../store/auth/auth.actions';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { LoginFormComponent } from '../../../../components/login-form/login-form.component';
import { SignupFormComponent } from '../../../../components/signup-form/signup-form.component';
import { Router } from '@angular/router';
import { CoursesService } from '../../services/courses.service';
import { EmailWarningModalComponent } from '../../components/email-warning-modal/email-warning-modal.component';
import { Page } from '../../../../shared/models/page.model';
import { PagedData } from '../../../../shared/models/paged-data.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit, OnDestroy {
  // Accesor properties
  get subtotal() {
    let subtotal = 0;
    if (this.cart) {
      this.cart.forEach((course) => {
        subtotal = subtotal + course.price;
      });
      return subtotal;
    }
    return 0;
  }
  get total() {
    let total = 0;
    if (this.cart) {
      this.cart.forEach((course) => {
        total = total + course.price * (1 - course.discount);
      });
      return total;
    }
    return 0;
  }
  cartSubscription: Subscription;
  cart: Course[];
  authStateSubcription: Subscription;
  user: User;
  isAuthenticated: boolean;

  // User wishlisted courses pagination
  wishedCourses: Course[];
  page = new Page({ size: 5 });

  constructor(
    private store: Store<State>,
    private cookieService: CookieService,
    private loginDialog: MatDialog,
    private signupDialog: MatDialog,
    private emailWarningDialog: MatDialog,
    private router: Router,
    private coursesService: CoursesService,
  ) {}

  ngOnInit() {
    this.cartSubscription = this.store
      .pipe(select(selectAuthCart))
      .subscribe((cart: Course[]) => {
        if (cart) {
          this.cart = cart;
        }
      });
    this.authStateSubcription = this.store
      .pipe(select(selectAuthState))
      .subscribe((authState: AuthState) => {
        if (authState.user) {
          this.user = authState.user;
          this.setPage({ offset: 1 });
        } else {
          this.user = undefined;
        }
        if (authState.isAuthenticated) {
          this.isAuthenticated = authState.isAuthenticated;
        } else {
          this.isAuthenticated = false;
        }
      });
  }

  ngOnDestroy() {
    this.cartSubscription.unsubscribe();
    this.authStateSubcription.unsubscribe();
  }

  onRemoveCourseFromCart(course: Course) {
    if (this.isAuthenticated) {
      this.store.dispatch(
        removeCourseFromCart({ courseId: course.id, userId: this.user.id }),
      );
    } else {
      let courseIds: string[] = [];
      // const cartCookie: string = this.cookieService.get('cartCookie');
      const cartCookie: string = localStorage.getItem('cartCookie');
      if (cartCookie) {
        courseIds = JSON.parse(cartCookie);
      }
      const newCourseIds = courseIds.filter((id: string) => id !== course.id);
      // this.cookieService.delete('cartCookie');
      localStorage.removeItem('cartCookie');
      // this.cookieService.set('cartCookie', JSON.stringify(newCourseIds));
      localStorage.setItem('cartCookie', JSON.stringify(newCourseIds));
      this.store.dispatch(pullCourseFromCarts({ course }));
    }
  }

  onCheckout() {
    if (this.isAuthenticated) {
      if (this.user.emailVerified) {
        console.log(
          'CartComponent: Authenticated state is true. Navigating to /courses/cart/checkout',
        );
        this.router.navigate(['./courses/cart/checkout']);
      } else {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.panelClass = 'custom-mat-dialog-container';
        dialogConfig.backdropClass = 'custom-modal-backdrop';
        dialogConfig.maxHeight = '80vh';
        let emailWarningDialogRef;
        emailWarningDialogRef = this.emailWarningDialog.open(
          EmailWarningModalComponent,
          dialogConfig,
        );
      }
    } else {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.panelClass = 'custom-mat-dialog-container';
      dialogConfig.backdropClass = 'custom-modal-backdrop';
      let loginDialogRef;
      let signupDialogRef;
      loginDialogRef = this.loginDialog.open(LoginFormComponent, dialogConfig);
      loginDialogRef.afterClosed().subscribe((result) => {
        if (result) {
          if (result.showSignUpModalOnClose) {
            signupDialogRef = this.signupDialog.open(
              SignupFormComponent,
              dialogConfig,
            );
          }
          if (this.isAuthenticated) {
            if (this.user.emailVerified) {
              console.log(
                'CartComponent: Authenticated state is true. Navigating to /courses/cart/checkout',
              );
              this.router.navigate(['./courses/cart/checkout']);
            } else {
              const dialogConfig = new MatDialogConfig();
              dialogConfig.autoFocus = true;
              dialogConfig.panelClass = 'custom-mat-dialog-container';
              dialogConfig.backdropClass = 'custom-modal-backdrop';
              dialogConfig.maxHeight = '80vh';
              let emailWarningDialogRef;
              emailWarningDialogRef = this.emailWarningDialog.open(
                EmailWarningModalComponent,
                dialogConfig,
              );
            }
          }
        }
      });
    }
  }

  /**
   * Paging function
   * @param pageInfo The page to select
   */
  setPage(pageInfo: { offset: number }) {
    this.page = this.page.copyWith({ pageNumber: pageInfo.offset });
    this.coursesService
      .getUserWishlistCoursesPagedData(this.page)
      .subscribe((pagedData: PagedData<Course>) => {
        // console.log(`Page number: ${pagedData.page.pageNumber}; Total pages: ${pagedData.page.totalPages}`);
        this.page = pagedData.page;
        this.wishedCourses = pagedData.data.asImmutable().toJS();
      });
  }

  /**
   * This function gets called when the user clicks a button of the ngx paginator component.
   * @param {number} pageNumber
   * @memberof CoursesComponent
   */
  wishedCoursesPageChanged(pageNumber: number) {
    this.setPage({ offset: pageNumber });
  }
}
