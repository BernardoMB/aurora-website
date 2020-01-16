import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoursesRoutingModule } from './courses-routing.module';
import { CoursesComponent } from './courses/courses.component';
import { AllCoursesComponent } from './views/all-courses/all-courses.component';
import { CourseCategoriesComponent } from './views/course-categories/course-categories.component';
import { CourseCategoryDetailComponent } from './views/course-category-detail/course-category-detail.component';
import { CourseDetailComponent } from './views/course-detail/course-detail.component';
import { LessonComponent } from './views/lesson/lesson.component';
import { LearnComponent } from './views/learn/learn.component';
import { CartComponent } from './views/cart/cart.component';
import { CourseCardComponent } from './components/course-card/course-card.component';
import { CategoryCardComponent } from './components/category-card/category-card.component';
import { LessonCardComponent } from './components/lesson-card/lesson-card.component';

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
        CourseCardComponent,
        CategoryCardComponent,
        LessonCardComponent,
    ],
    imports: [CommonModule, CoursesRoutingModule],
})
export class CoursesModule {}
