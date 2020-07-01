import { PointLocation } from '../../../shared/models/point-location.model';

export class Event {
  id: string;
  name: string;
  description: string;
  imgUrl: string;
  startDate: Date;
  endDate: Date;
  address: string;
  organizer: string;
  location: PointLocation;
  subscribed: Array<string>;
  createdAt: Date;
  updatedAt: Date;
}
