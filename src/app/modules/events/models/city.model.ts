import { PointLocation } from '../../../shared/models/point-location.model';

export interface City {
  name: string;
  region?: string;
  country: string;
  location: PointLocation;
}
