export interface Review {
    id: string;
    user: any; // Type any because of population
    course: string;
    review: string;
    rating: number;
    createdAt: string;
    updatedAt: string;
}
