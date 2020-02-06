import { createAction, props } from '@ngrx/store';
import { Course } from 'src/app/shared/models/course.model';

export const purchaseCart = createAction(
    '[Courses] Purchase cart'
); // There is no need of a payload because the cart is already persisted in the server
export const purchaseCartSuccess = createAction(
    '[Courses] Purchase cart Success',
    props<{ purchasedCourses: Array<Course> }>(),
);
export const purchaseCartFailure = createAction(
    '[Courses] Purchase cart Failure',
    props<{}>(), // TODO: handle error
);


// TODO: add course to whish list

// TODO: review course

// TODO: complete lesson

// TODO: add course to favorite

// TODO: archive course
