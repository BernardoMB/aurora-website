import { PaginationParams } from './dto/pagination-params.dto';
import { cloneDeep } from 'lodash';

export type PageParams = {
  // The number of elements in the page
  readonly size: number;
  // The total number of pages
  readonly totalElements: number;
  // The total number of pages
  readonly totalPages: number;
  // The current page number
  readonly pageNumber: number;
};

/**
 * An object used to get page information from the server
 */
export class Page implements PageParams {
  public readonly size: number;
  // The total number of elements
  public readonly totalElements: number;
  // The total number of pages
  public readonly totalPages: number;
  // The current page number
  public readonly pageNumber: number;
  /**
   * @param  {Partial<PageParams>={}} options - the initializing data
   */
  constructor(options: Partial<PageParams> = {}) {
    this.size = options?.size ?? 0;
    this.totalElements = options?.totalElements ?? 0;
    this.totalPages = options?.totalPages ?? 0;
    this.pageNumber = options?.pageNumber ?? 1;
  }

  /**
   * @returns {PaginationParams} - the page as a server pagination query
   */
  toPaginationParams(): PaginationParams {
    return {
      skip: this.size * (this.pageNumber - 1),
      limit: this.size,
    };
  }

  /**
   * @returns {PageParams} - the page as a js object
   */
  toJS(): PageParams {
    return {
      size: this.size,
      totalElements: this.totalElements,
      totalPages: this.totalPages,
      pageNumber: this.pageNumber,
    };
  }

  /**
   * @param  {Partial<Page>} values - values to override
   * @returns Page - a new page instance with overriden values
   */
  copyWith(values: Partial<Page>): Page {
    return new (this.constructor as any)({
      ...cloneDeep(this),
      ...cloneDeep(values),
    });
  }
}
