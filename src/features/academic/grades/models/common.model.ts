// models/common.model.ts

export interface PaginatedResponse<T> {
  count: number; // total number of items
  next: string | null; // next page URL
  previous: string | null; // previous page URL
  results: T[]; // array of data items
}
