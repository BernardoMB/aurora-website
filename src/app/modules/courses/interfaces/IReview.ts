export interface IReview {
  rating: number;
  review: string;
  user: {
    name: string,
    lastName: string
  };
}
