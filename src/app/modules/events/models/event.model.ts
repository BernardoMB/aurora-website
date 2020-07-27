import { PointLocation } from '../../../shared/models/point-location.model';
import { Set as ImmutableSet, fromJS, Collection } from 'immutable';
import { cloneDeep } from 'lodash';
import { IEvent } from './interfaces/event.interface';
import { classToClassFromExist } from 'class-transformer';

export type EventParams = {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly imgUrl: string;
  readonly startDate: Date;
  readonly endDate: Date;
  readonly address: string;
  readonly organizer: string;
  readonly location: PointLocation;
  readonly subscribed: any[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
};

/**
 * An object used to get page information from the server
 */
export class Event implements IEvent {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly imgUrl: string;
  readonly startDate: Date;
  readonly endDate: Date;
  readonly address: string;
  readonly organizer: string;
  readonly location: PointLocation;
  readonly subscribed: ImmutableSet<string>;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  /**
   * @param  {Partial<EventParams>{}} options - the initializing data
   */
  constructor(options: Partial<EventParams> = {}) {
    this.id = options?.id ?? '';
    this.name = options?.name ?? '';
    this.description = options?.description ?? '';
    this.imgUrl = options?.imgUrl ?? '';
    (this.startDate = options?.startDate ?? new Date()),
      (this.endDate = options?.endDate ?? new Date()),
      (this.address = options?.address ?? '');
    this.organizer = options?.organizer ?? '';
    (this.location = options?.location ?? undefined),
      (this.subscribed = ImmutableSet<string>(
        cloneDeep<Collection.Indexed<string>>(fromJS(options?.subscribed)) ??
          [],
      ));
    (this.createdAt = options?.createdAt ?? new Date()),
      (this.updatedAt = options?.updatedAt ?? new Date());
  }

  /**
   * @returns {EventParams} - the page as a js object
   */
  toJS(): IEvent {
    return cloneDeep<IEvent>({
      id: this.id,
      name: this.name,
      description: this.description,
      imgUrl: this.imgUrl,
      startDate: this.startDate,
      endDate: this.endDate,
      address: this.address,
      organizer: this.organizer,
      location: this.location,
      subscribed: this.subscribed.toSet(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });
  }

  /**
   * @param  {Partial<Page>} values - values to override
   * @returns Page - a new page instance with overriden values
   */
  copyWith(values: Partial<Event>): Event {
    return classToClassFromExist(
      cloneDeep({ ...values } as Event),
      cloneDeep({
        ...this,
        subscribed: cloneDeep(this.subscribed.toSet()) as ImmutableSet<string>,
      }),
    );
  }

  static fromJSON(json: string) {
    return new this(cloneDeep(JSON.parse(json)));
  }
}
