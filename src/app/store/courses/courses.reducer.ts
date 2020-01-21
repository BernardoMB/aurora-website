import { initialCoursesState, CoursesState } from './courses.state';
import { createReducer, on, Action } from '@ngrx/store';

export const coursesFeatureKey = 'courses';

const coursesReducer = createReducer(initialCoursesState);

export function reducer(state: CoursesState | undefined, action: Action) {
  return coursesReducer(state, action);
}
