import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoursesComponent } from './courses/courses.component';
import { AllCoursesComponent } from './views/all-courses/all-courses.component';
import { CourseCategoryDetailComponent } from './views/course-category-detail/course-category-detail.component';
import { CourseDetailComponent } from './views/course-detail/course-detail.component';
import { LessonComponent } from './views/lesson/lesson.component';
import { LearnComponent } from './views/learn/learn.component';
import { CartComponent } from './views/cart/cart.component';
import { ExpressCheckoutComponent } from './views/express-checkout/express-checkout.component';
import { CheckoutComponent } from './views/checkout/checkout.component';
import { CheckoutGuard } from './guards/checkout.guard';
import { MyCoursesComponent } from './views/my-courses/my-courses.component';
import { AllMyCoursesComponent } from './views/all-my-courses/all-my-courses.component';
import { WishlistComponent } from './views/wishlist/wishlist.component';
import { ArchivedComponent } from './views/archived/archived.component';
import { FavoriteComponent } from './views/favorite/favorite.component';

/* courses/  */
const routes: Routes = [
  { path: '', component: CoursesComponent, data: { animation: 'courses' } },
  { path: 'all', component: AllCoursesComponent },
  { path: 'cart/checkout/express/course/:courseId', component: ExpressCheckoutComponent, canActivate: [CheckoutGuard] },
  { path: 'cart/checkout', component: CheckoutComponent, canActivate: [CheckoutGuard] },
  { path: 'cart', component: CartComponent },
  { path: 'categories/:id', component: CourseCategoryDetailComponent },
  /**
   * // This can be implemented later without any regards
   *  { path: 'categories', component: CourseCategoriesComponent },
   */
  {
    path: 'my-courses', // <-- this route should implement a route guard
    component: MyCoursesComponent, canActivate: [CheckoutGuard],
    children: [
      { path: '', redirectTo: 'learning', pathMatch: 'full' },
      { path: 'learning', component: AllMyCoursesComponent },
      { path: 'favorite', component:  FavoriteComponent},
      { path: 'wishlist', component:  WishlistComponent},
      { path: 'archived', component:  ArchivedComponent},
    ],
  },
  {
    path: ':id/learn', // <-- this route should implement a route guard
    component: LearnComponent,
    children: [
      { path: 'lesson/:id', component: LessonComponent }
    ],
  },
  {
    path: ':id',
    component: CourseDetailComponent,
    data: { animation: 'course' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoursesRoutingModule {}
