import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoursesComponent } from './courses/courses.component';
import { AllCoursesComponent } from './components/all-courses/all-courses.component';
import { CourseCategoriesComponent } from './components/course-categories/course-categories.component';
import { CourseCategoryDetailComponent } from './components/course-category-detail/course-category-detail.component';
import { CourseDetailComponent } from './components/course-detail/course-detail.component';
import { LessonComponent } from './components/lesson/lesson.component';
import { LearnComponent } from './components/learn/learn.component';
import { CartComponent } from './components/cart/cart.component';

const routes: Routes = [
    { path: '', component: CoursesComponent, data: { animation: 'courses' } },
    { path: 'all', component: AllCoursesComponent },
    {
        path: ':id/learn', // <-- this route should implement a route guard
        component: LearnComponent,
        children: [{ path: 'lesson/:id', component: LessonComponent }],
    },
    {
        path: ':id',
        component: CourseDetailComponent,
        data: { animation: 'course' },
    },
    { path: 'categories/:id', component: CourseCategoryDetailComponent },
    { path: 'categories', component: CourseCategoriesComponent },
    { path: 'cart', component: CartComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CoursesRoutingModule {}
