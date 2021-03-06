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
  likedArticles?: string[];
  eventSubscriptions?: string[];
  dislikedArticles?: string[];
  favoriteCourses?: string[];
  wishList?: string[];
  archivedCourses?: string[];
  nameTitle?: string;
}
