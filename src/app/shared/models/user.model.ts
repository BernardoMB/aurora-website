import { Course } from './course.model';

export class User {
  id?: string;
  email?: string;
  username?: string;
  emailVerified?: boolean;
  name?: string;
  lastName?: string;
  purchasedCourses?: Array<{ progress: string[], course: string }>;
  cart?: Course[];
  courses?: string[];
}
