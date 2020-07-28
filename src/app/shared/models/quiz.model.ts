import { Assesment } from './assesment.model';

export interface Quiz {
  assesments: Array<Assesment>;
  title: string;
  description: string;
  type: string;
  course: string;
  createdAt: string;
  updatedAt: string;
  id: string;
}
