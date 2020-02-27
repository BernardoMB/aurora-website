import { Category } from './category.model';

export interface Course {
    labels: string[];
    reviews: string[];
    enrolledUsers: string[];
    featured: boolean;
    lessons: string[] | any[]; // type array of any because of population
    name: string;
    description: string;
    category: any; // type any because of population
    rating: number;
    price: number;
    discount: number;
    overview: string;
    createdAt: Date;
    updatedAt: Date;
    imgUrl: string;
    id: string;
    totalReviews: number;
    totalRating: number;
}
