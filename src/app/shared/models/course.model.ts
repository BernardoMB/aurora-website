import { Category } from './category.model';
import { Review } from './review.model';
import { CourseObject } from './course-object.model';

export interface Course {
    labels: string[];
    reviews: string[] | Review[]; // type array of reviews because of population
    enrolledUsers: string[];
    featured: boolean;
    lessons: string[] | any[]; // type array of any because of population

    // ! Here
    courseObjects: CourseObject[];

    name: string;
    description: string;
    category: any; // type any because of population
    rating: number;
    price: number;
    discount: number;
    overview: string;
    createdAt: string;
    updatedAt: string;
    imgUrl: string;
    id: string;
    totalReviews: number;
    totalRating: number;
}
