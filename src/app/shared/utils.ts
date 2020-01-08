/**
 * An object used to get page information from the server
 */
export class Page {
    // The number of elements in the page
    size = 0;
    // The total number of elements
    totalElements = 0;
    // The total number of pages
    totalPages = 0;
    // The current page number
    pageNumber = 0;
}

/**
 * An array of data with an associated page object used for paging
 */
export class PagedData<T> {
    data = new Array<T>();
    page = new Page();
}

export const log = (message?: string, value?: any) => {
    const shouldLog = true;
    if (shouldLog) {
        console.log(message, value);
    }
};
