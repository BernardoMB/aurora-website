import { Course } from './course.model';

export interface IPurchasedCourse {
  progress: string[];
  course: string;
}

export class User {
  id?: string;
  email?: string;
  username?: string;
  emailVerified?: boolean;
  name?: string;
  lastName?: string;
  purchasedCourses?: IPurchasedCourse[];
  cart?: Course[];
  courses?: string[];
  favoriteCourses?: string[];
}
