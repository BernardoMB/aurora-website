import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

// more specific routes should be placed above less specific routes
const routes: Routes = [
    // Landing
    { path: 'home', component: LandingComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    // Feature modules
    {
        path: 'courses',
        loadChildren: () =>
            import('./modules/courses/courses.module').then(
                mod => mod.CoursesModule,
            ),
    },
    {
        path: 'news',
        loadChildren: () =>
            import('./modules/news/news.module').then(mod => mod.NewsModule),
    },
    {
        path: 'events',
        loadChildren: () =>
            import('./modules/events/events.module').then(
                mod => mod.EventsModule,
            ),
    },
    {
        path: 'profile', // TODO: This route should have an auth guard
        loadChildren: () =>
            import('./modules/profile/profile.module').then(
                mod => mod.ProfileModule,
            ),
    },
    // Wildcard route.
    // It matches every URL and should be selected only if no other routes are matched first.
    // This wildcard route should be the last route declared in the hole application.
    { path: '**', component: NotFoundComponent },
];

@NgModule({
    imports: [
        RouterModule.forRoot(
            routes,
            { enableTracing: true }, // <-- debugging purposes only
        ),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
