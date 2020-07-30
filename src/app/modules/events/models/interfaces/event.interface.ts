import { PointLocation } from '../../../../shared/models/point-location.model';
import { Set as ImmutableSet } from 'immutable';

export interface IEvent {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly imgUrl: string;
  readonly startDate: Date;
  readonly endDate: Date;
  readonly address: string;
  readonly organizer: string;
  readonly location: PointLocation;
  readonly subscribed: string[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
