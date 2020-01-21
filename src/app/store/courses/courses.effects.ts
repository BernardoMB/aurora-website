import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CoursesService } from '../../modules/courses/services/courses.service';

/**
 * Courses effects
 * TODO: Implement failure effects (error handling)
 *
 * @export
 */
@Injectable()
export class CoursesEffects {

  constructor(
    private actions$: Actions,
    private coursesService: CoursesService
  ) {}

}
