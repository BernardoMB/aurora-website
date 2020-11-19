import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, Event } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnDestroy {
  routerSubscription: Subscription;
  showFooter = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.routerSubscription = this.router.events.pipe(
      filter((event: Event) => {
        return event instanceof NavigationEnd;
      })
    ).subscribe((event: NavigationEnd) => {
      // console.log('Router event', event);
      // console.log('Route snapshot', this.route.snapshot);
      const urlParams = event.urlAfterRedirects.split('/');
      console.log(urlParams);
      if (urlParams.length >= 4 && urlParams[3] === 'learn') {
        this.showFooter = false;
      } else {
        this.showFooter = true;
      }
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }

}
