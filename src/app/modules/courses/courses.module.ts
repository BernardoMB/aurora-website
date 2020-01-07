import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoursesRoutingModule } from './courses-routing.module';
import { CoursesComponent } from './courses/courses.component';
import { AllCoursesComponent } from './components/all-courses/all-courses.component';
import { CourseCategoriesComponent } from './components/course-categories/course-categories.component';
import { CourseCategoryDetailComponent } from './components/course-category-detail/course-category-detail.component';
import { CourseDetailComponent } from './components/course-detail/course-detail.component';
import { LessonComponent } from './components/lesson/lesson.component';
import { LearnComponent } from './components/learn/learn.component';
import { CartComponent } from './components/cart/cart.component';

@NgModule({
    declarations: [
        CoursesComponent,
        AllCoursesComponent,
        CourseCategoriesComponent,
        CourseCategoryDetailComponent,
        CourseDetailComponent,
        LessonComponent,
        LearnComponent,
        CartComponent,
    ],
    imports: [CommonModule, CoursesRoutingModule],
})
export class CoursesModule {}
