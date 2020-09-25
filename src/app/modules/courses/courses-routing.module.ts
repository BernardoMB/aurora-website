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
import { LearningGuard } from './guards/learning.guard';
import { LessonResolver } from './resolvers/lesson-resolver.service';
import { LearnResolver } from './resolvers/learn-resolver.service';
import { CourseDetailResolver } from './resolvers/course-detail.resolver.service';
import { CategoryDetailResolver } from './resolvers/category-detail.resolver.service';
import { MyCoursesResolver } from './resolvers/my-courses.resolver.service';
import { CheckoutResolver } from './resolvers/checkout.resolver.service';
import { QuizComponent } from './views/quiz/quiz.component';
import { QuizResolver } from './resolvers/quiz-resolver.service';

/* courses/  */
const routes: Routes = [
  { path: '', component: CoursesComponent,
    data: { animation: 'courses' }
  },
  { path: 'all', component: AllCoursesComponent },
  {
    path: 'cart/checkout/express/course/:courseId',
    component: ExpressCheckoutComponent,
    canActivate: [CheckoutGuard],
    resolve: { checkoutInfo: CheckoutResolver }
  },
  {
    path: 'cart/checkout',
    component: CheckoutComponent,
    canActivate: [CheckoutGuard],
    resolve: { checkoutInfo: CheckoutResolver }
  },
  { path: 'cart', component: CartComponent },
  { path: 'categories/:id', component: CourseCategoryDetailComponent, resolve: { categoryDetailInfo: CategoryDetailResolver }, },
  /**
   * // This can be implemented later without any regards
   *  { path: 'categories', component: CourseCategoriesComponent },
   */
  {
    path: 'my-courses',
    component: MyCoursesComponent, canActivate: [CheckoutGuard],
    resolve: { myCoursesInfo: MyCoursesResolver },
    children: [
      { path: '', redirectTo: 'all', pathMatch: 'full' },
      { path: 'all', component: AllMyCoursesComponent },
      { path: 'favorite', component:  FavoriteComponent},
      { path: 'wishlist', component:  WishlistComponent},
      { path: 'archived', component:  ArchivedComponent},
    ],
  },
  {
    path: ':id/learn',
    component: LearnComponent,
    canActivate: [LearningGuard],
    resolve: { learningInfo: LearnResolver },
    children: [
      { path: 'lesson/:id', component: LessonComponent, resolve: { lesson: LessonResolver } },
      { path: 'quiz/:id', component: QuizComponent, resolve: { quizInfo: QuizResolver } },
    ],
  },
  {
    path: ':id',
    component: CourseDetailComponent,
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    resolve: { courseDetailInfo: CourseDetailResolver },
    data: { animation: 'course' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoursesRoutingModule {}
