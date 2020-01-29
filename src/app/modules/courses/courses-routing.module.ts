import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoursesComponent } from './courses/courses.component';
import { AllCoursesComponent } from './views/all-courses/all-courses.component';
import { CourseCategoryDetailComponent } from './views/course-category-detail/course-category-detail.component';
import { CourseDetailComponent } from './views/course-detail/course-detail.component';
import { LessonComponent } from './views/lesson/lesson.component';
import { LearnComponent } from './views/learn/learn.component';
import { CartComponent } from './views/cart/cart.component';

/* courses/  */
const routes: Routes = [
  { path: '', component: CoursesComponent, data: { animation: 'courses' } },
  { path: 'all', component: AllCoursesComponent },
  { path: 'cart', component: CartComponent },
  { path: 'categories/:id', component: CourseCategoryDetailComponent },
  /**
   * // This can be implemented later without any regards
   *  { path: 'categories', component: CourseCategoriesComponent },
   */
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
