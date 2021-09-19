import { stringify } from 'query-string';
import { Page } from '../page.model';
import { ImmutableRecord } from '../base/immutable-record.model';
import { Map as ImmutableMap } from 'immutable';

export type PaginationParams = {
  skip: number;
  limit: number;
};

const defaultParams: PaginationParams = {
  skip: 0,
  limit: 0,
};

class PaginationDtoBuilder {
  private _data: ImmutableMap<string, number>;
  constructor(pagination?: PaginationDto) {
    this._data = pagination
      ? ImmutableMap<string, number>({ ...(pagination.toJSObject() as any) })
      : ImmutableMap<string, number>();
  }
  skip(skip: number): PaginationDtoBuilder {
    this._data.merge({ skip });
    return this;
  }
  limit(limit: number): PaginationDtoBuilder {
    this._data.merge({ limit });
    return this;
  }
  build(): PaginationDto {
    return new PaginationDto(this._data.toJS());
  }
}

export default class PaginationDto extends ImmutableRecord<PaginationParams>
  implements PaginationParams {
  public readonly skip: number;
  public readonly limit: number;

  get queryString(): string {
    return stringify(this, {});
  }

  constructor(params?: Partial<PaginationParams>) {
    if (params) {
      super({
        ...params,
        ...defaultParams,
      });
    } else {
      super({
        ...defaultParams,
      });
    }
  }

  *[Symbol.iterator](): Iterator<[string, number], any, undefined> {
    yield ['skip', this.skip];
    yield ['limit', this.limit];
  }

  toJSObject(): object {
    return {
      skip: this.skip,
      limit: this.limit,
    };
  }

  static fromPage(page: Page): PaginationDto {
    return new PaginationDto(page.toPaginationParams());
  }
  static builder(person?: PaginationDto): PaginationDtoBuilder {
    return new PaginationDtoBuilder(person);
  }
}
