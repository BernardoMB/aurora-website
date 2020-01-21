export interface Course {
    labels: string[];
    reviews: string[];
    enrolledUsers: string[];
    featured: boolean;
    lessons: string[];
    name: string;
    description: string;
    category: string;
    price: number;
    discount: number;
    overview: string;
    createdAt: Date;
    updatedAt: Date;
    imgUrl: string;
    id: string;
}