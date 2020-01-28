import { Course } from 'src/app/shared/models/course.model';

export interface CoursesState {
    purchasedCourses?: Array<{ progress: string[], course: Course }>;
    cart?: Array<Course> 
}

export const initialCoursesState: CoursesState = {
    purchasedCourses: [],
    cart: [] 
}
