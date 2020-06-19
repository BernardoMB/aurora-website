import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  Inject,
  PLATFORM_ID,
  OnDestroy,
  ViewChild,
  HostListener,
} from '@angular/core';
import { WindowRef } from '../../providers/window.provider';
import { DocumentRef } from '../../providers/document.provider';
import { isPlatformBrowser } from '@angular/common';
import { of, fromEvent, Subscription } from 'rxjs';
import { map, pairwise, switchMap, throttleTime, filter, catchError } from 'rxjs/operators';
import { User } from '../../shared/models/user.model';
import { ActivatedRoute, Router, NavigationEnd, Event } from '@angular/router';
import { Category } from 'src/app/shared/models/category.model';
import { CoursesService } from 'src/app/modules/courses/services/courses.service';
import { Store, select } from '@ngrx/store';
import { AuthState } from '../../store/auth/auth.state';
import { selectAuthCart, selectAuthUser } from '../../store/auth/auth.selectors';
import { MatMenuTrigger } from '@angular/material/menu';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

/**
 * The header of the application.
 *
 * @export
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  mobileNavBarOpen = false;
  @ViewChild(MatMenuTrigger, { static: true }) cartMenuTrigger: MatMenuTrigger;
  @ViewChild(MatMenuTrigger, { static: true }) userMenuTrigger: MatMenuTrigger;
  usr: User = undefined;
  userV: User;
  userSubscription: Subscription;
  @Input() set user(user: User) {
    this.usr = user || undefined;
  }
  get user() {
    return this.usr;
  }
  showEmailWarning = false;
  @Output() login: EventEmitter<void> = new EventEmitter();
  @Output() logout: EventEmitter<void> = new EventEmitter();
  @Output() register: EventEmitter<void> = new EventEmitter();
  @Output() viewProfile: EventEmitter<void> = new EventEmitter();
  @Output() viewShoppingKart: EventEmitter<void> = new EventEmitter();
  private document: Document;
  private window: Window;
  onLandingPage: boolean;
  loggedIn: boolean;
  currentSection = '';
  routerSubscription: Subscription;
  cartSubscription: Subscription;
  showCategories = false;
  categories: Category[];
  cart: any[];
  showGoToCartButton = true;
  private routeHistory = [];
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

  // Sticky header
  isSticky = false;
  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    this.isSticky = window.pageYOffset >= 250;
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    @Inject(WindowRef) private windowRef: WindowRef,
    @Inject(DocumentRef) private documentRef: DocumentRef,
    private router: Router,
    private readonly route: ActivatedRoute,
    private coursesService: CoursesService,
    private authStore: Store<AuthState>,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    this.loggedIn = false;
    this.routerSubscription = this.router.events.pipe(
      filter((event: Event) => {
        return event instanceof NavigationEnd;
      })
    ).subscribe((event: NavigationEnd) => {
      // #region History of routes
      /**
       * Uncomment the code below if the header cares for
       * the previous route requested
       */
      /* this.routeHistory = [...this.routeHistory, event.urlAfterRedirects];
      if (event.id === 1 && this.route.firstChild.snapshot.url[0].path === 'courses') {
        this.getCategories();
      }
      if (event.id !== 1 && this.route.firstChild.snapshot.url[0].path === 'courses') {
        const previousPath = this.history[this.history.length - 2];
        if (!previousPath.includes('courses')) {
          this.getCategories();
        }
      } */
      // #endregion
      this.mobileNavBarOpen = false; // <-- default ui state
      this.showCategories = false; // <-- default ui state
      if (this.route.firstChild.snapshot.url[0].path === 'courses') {
        this.showCategories = true;
        this.getCategories();
      }
      // The following code hides the Go to cart button from the cart menu if the
      // user is already in the cart view
      this.showGoToCartButton = true; // <-- default ui state
      if (this.route.firstChild.firstChild) {
        if (this.route.firstChild.firstChild.snapshot.url[0]) {
          // console.log('URL', this.route.firstChild.firstChild.snapshot.url);
          if (this.route.firstChild.firstChild.snapshot.url[0].path === 'cart') {
            this.showGoToCartButton = false;
          }
          if (this.route.firstChild.firstChild.snapshot.url[1]) {
            this.showGoToCartButton = true;
          }
        }
      }
    });
  }

  ngOnInit() {
    // #region sections logic
    // TODO: Fix this code section
    if (isPlatformBrowser(this.platformId)) {
      this.window = this.windowRef.nativeWindow as Window;
      this.document = this.documentRef.nativeDocument as Document;
      fromEvent(this.window, 'scroll')
        .pipe(
          map(() => this.window.pageYOffset),
          pairwise(),
          map(([prev, curr]) => Math.abs(prev - curr) > 20),
          switchMap(isFast => {
            if (isFast) {
              return of({}).pipe(throttleTime(20));
            } else {
              return of({});
            }
          }),
        )
        .subscribe(() => {
          const offset =
            this.window.pageYOffset + this.window.screen.height / 2;
          const sectionsIds = [
            'about',
            'products',
            'security',
            'features',
            'download',
            'contact',
          ];
          sectionsIds.forEach((sectionId: string) => {
            !!this.document.getElementById(sectionId)
              ? (this.onLandingPage = true)
              : (this.onLandingPage = false);
          });
          if (this.onLandingPage) {
            const offsets = sectionsIds.map(id =>
              !!this.document.getElementById(id)
                ? this.document.getElementById(id).offsetTop
                : 0,
            );
            if (offsets[0] <= offset && offset < offsets[1]) {
              this.currentSection = 'about';
            } else if (offsets[1] <= offset && offset < offsets[2]) {
              this.currentSection = 'products';
            } else if (offsets[2] <= offset && offset < offsets[3]) {
              this.currentSection = 'security';
            } else if (offsets[3] <= offset && offset < offsets[4]) {
              this.currentSection = 'features';
            } else if (offsets[4] <= offset && offset < offsets[5]) {
              this.currentSection = 'download';
            } else if (offsets[5] <= offset /* && offset < offsets[6] */) {
              this.currentSection = 'contact';
            }
          } else {
            this.currentSection = undefined;
          }
        });
    }
    // #endregion sections logic
    this.cartSubscription = this.authStore.pipe(select(selectAuthCart)).subscribe((cart: any[]) => {
      if (cart) {
        this.cart = cart;
      }
    });

    this.userSubscription = this.authStore.pipe(select(selectAuthUser)).subscribe((user: User) => {
      if (user) {
        this.userV = user;
        if (!user.emailVerified) {
          this.showEmailWarning = true;
        } else {
          this.showEmailWarning = false;
        }
      } else {
        this.showEmailWarning = false;
      }
    });
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
    this.cartSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }

  getCategories() {
    this.coursesService.getCategories().subscribe((categories: Category[]) => {
      if (categories) {
        this.categories = categories;
        this.showCategories = true;
      }
    });
  }

  onLogin() {
    this.mobileNavBarOpen = false;
    this.login.emit();
  }

  onRegister() {
    this.mobileNavBarOpen = false;
    this.register.emit();
  }

  onLogout() {
    this.logout.emit();
  }

  onGoToCourse(courseId: string) {
    console.log(`Header component: Redirecting to /courses/${courseId}`);
    this.router.navigate(['/courses', courseId]);
  }

  onHelp() {
    // TODO: implement this function
  }

  onViewProfile() {
    this.viewProfile.emit();
  }

  onViewShoppingKart() {
    this.viewShoppingKart.emit();
  }

  handleMobileLinkClick() {
    this.mobileNavBarOpen = false;
  }

  dismissEmailWarning() {
    this.showEmailWarning = false;
  }

  resendEmail() {
    this.authService.resendEmailVerification().pipe(
      catchError((error) => {
        console.log(error);
        throw error;
        this.toastr.error('Could not send verification email');
      })
      ).subscribe((emailVerificationSend: boolean) => {
        if (emailVerificationSend) {
          this.toastr.success('Verification email sent');
      }
    });
  }
}
