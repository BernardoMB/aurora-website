import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { MainComponent } from './components/main/main.component';
import { LandingComponent } from './components/landing/landing.component';
import { ForgotEmailSentComponent } from './components/forgot-email-sent/forgot-email-sent.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';

// more specific routes should be placed above less specific routes
export const appRoutes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: '', redirectTo: '/home', pathMatch: 'full' },
      { path: 'home', component: LandingComponent },
      {
        path: 'courses',
        loadChildren: () =>
          import('./modules/courses/courses.module').then(
            (mod) => mod.CoursesModule,
          ),
      },
      {
        path: 'news',
        loadChildren: () =>
          import('./modules/news/news.module').then((mod) => mod.NewsModule),
      },
      {
        path: 'events',
        loadChildren: () =>
          import('./modules/events/events.module').then(
            (mod) => mod.EventsModule,
          ),
      },
      {
        path: 'invest',
        loadChildren: () =>
          import('./modules/invest/invest.module').then(
            (mod) => mod.InvestModule,
          ),
      },
      {
        path: 'community',
        loadChildren: () =>
          import('./modules/community/community.module').then(
            (mod) => mod.CommunityModule,
          ),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./modules/profile/profile.module').then(
            (mod) => mod.ProfileModule,
          ),
      },
      { path: 'user/forgot-password', component: ForgotEmailSentComponent },
      { path: 'user/email-password-change', component: ResetPasswordComponent },
      { path: '**', component: NotFoundComponent },
    ],
  },
  // Wildcard route.
  // It matches every URL and should be selected only if no other routes are matched first.
  // This wildcard route should be the last route declared in the hole application.
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {
      enableTracing: false, // <-- debugging purposes only
      scrollPositionRestoration: 'disabled',
      anchorScrolling: 'disabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
