import { Page } from './page.model';
import { Set as ImmutableCollection } from 'immutable';
import { ServerPagedDataDto } from './dto/server-paged-data.dto';

/**
 * An array of data with an associated page object used for paging
 */
export class PagedData<T> {
  data: ImmutableCollection<T>;
  page = new Page();
  constructor(pagedData: ServerPagedDataDto<T>, page?: Partial<Page>) {
    this.data = ImmutableCollection<T>(pagedData.data ?? []);
    const totalElements = pagedData.count ?? this.data.count();
    const size = page?.size ?? totalElements;
    const totalPages = Math.ceil(totalElements / size);
    const pageNumber = page?.pageNumber ?? 1;
    this.page = new Page({
      size,
      totalElements,
      totalPages,
      pageNumber,
    });
  }
}
