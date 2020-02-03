import { Category } from './category.model';

export interface Course {
    labels: string[];
    reviews: string[];
    enrolledUsers: string[];
    featured: boolean;
    lessons: string[];
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
}
