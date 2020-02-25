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
import { SharedModule } from 'src/app/shared/shared.module';
import { ReviewCardComponent } from './components/review-card/review-card.component';
import { CoursesService } from './services/courses.service';
import { AmpPlayerComponent } from './components/amp-player/amp-player.component';
import { ExpressCheckoutComponent } from './views/express-checkout/express-checkout.component';
import { CheckoutComponent } from './views/checkout/checkout.component';
import { CheckoutGuard } from './guards/checkout.guard';
import { MyCoursesComponent } from './views/my-courses/my-courses.component';
import { AllMyCoursesComponent } from './views/all-my-courses/all-my-courses.component';
import { WishlistComponent } from './views/wishlist/wishlist.component';
import { ArchivedComponent } from './views/archived/archived.component';
import { FavoriteComponent } from './views/favorite/favorite.component';
import { LearningGuard } from './guards/learning.guard';
import { LessonsService } from './services/lessons.service';
import { LessonResolver } from './resolvers/lesson-resolver.service';
import { CourseResolver } from './resolvers/course-resolver.service';
import { CourseDetailResolver } from './resolvers/course-detail.resolver.service';
import { StarRatingComponent } from './components/star-rating/star-rating.component';
import { MaterialModule } from '../../material.module';
import { ReviewModalComponent } from './components/review-modal/review-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
        ReviewCardComponent,
        AmpPlayerComponent,
        ExpressCheckoutComponent,
        CheckoutComponent,
        MyCoursesComponent,
        AllMyCoursesComponent,
        WishlistComponent,
        ArchivedComponent,
        FavoriteComponent,
        StarRatingComponent,
        ReviewModalComponent
    ],
    imports: [
      CommonModule,
      CoursesRoutingModule,
      SharedModule,
      MaterialModule,
      FormsModule,
      ReactiveFormsModule
    ],
    providers: [
      CoursesService,
      CheckoutGuard,
      LearningGuard,
      LessonsService,
      LessonResolver,
      CourseResolver,
      CourseDetailResolver
    ],
    entryComponents: [ReviewModalComponent]
})
export class CoursesModule {}
