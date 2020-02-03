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
} from '@angular/core';
import { WindowRef } from '../../providers/window.provider';
import { DocumentRef } from '../../providers/document.provider';
import { isPlatformBrowser } from '@angular/common';
import { of, fromEvent, Subscription } from 'rxjs';
import { map, pairwise, switchMap, throttleTime, filter, tap } from 'rxjs/operators';
import { User } from '../../shared/models/user.model';
import { ActivatedRoute, Router, NavigationEnd, Event } from '@angular/router';
import { Category } from 'src/app/shared/models/category.model';
import { CoursesService } from 'src/app/modules/courses/services/courses.service';
import { Store, select } from '@ngrx/store';
import { AuthState } from '../../store/auth/auth.state';
import { selectAuthCart } from '../../store/auth/auth.selectors';
import { MatMenuTrigger } from '@angular/material';

/**
 * The header of the application.
 * This is a dummy component.
 *
 * @export
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  @ViewChild(MatMenuTrigger, { static: true }) cartMenuTrigger: MatMenuTrigger;
  usr: User = undefined;
  @Input() set user(user: User) {
    this.usr = user || undefined;
  }
  get user() {
    return this.usr;
  }
  showUserMenu = false;
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
  showCategories = false;
  categories: Category[];
  cart: any[];
  private history = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    @Inject(WindowRef) private windowRef: WindowRef,
    @Inject(DocumentRef) private documentRef: DocumentRef,
    private router: Router,
    private readonly route: ActivatedRoute,
    private coursesService: CoursesService,
    private authStore: Store<AuthState>,
  ) {
    this.loggedIn = false;
    this.routerSubscription = this.router.events.pipe(
      filter((event: Event) => {
        return event instanceof NavigationEnd;
      })
    ).subscribe((event: NavigationEnd) => {
      this.showCategories = false;
      // #region History of routes
      /**
       * Uncomment the code below if the header cares for
       * the previous route requested
       */
      /* this.history = [...this.history, event.urlAfterRedirects];
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
      if (this.route.firstChild.snapshot.url[0].path === 'courses') {
        this.showCategories = true;
        this.getCategories();
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
    this.authStore.pipe(select(selectAuthCart)).subscribe((cart: any[]) => {
      if (cart) {
        this.cart = cart;
      }
    });
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
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
    this.login.emit();
  }

  onLogout() {
    this.logout.emit();
  }

  onRegister() {
    this.register.emit();
  }

  onViewMayCourses() {
    // TODO: implement this function
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
}
