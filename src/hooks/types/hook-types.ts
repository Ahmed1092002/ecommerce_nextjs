/**
 * Standard hook return type with loading and error states
 */
export interface UseHookState {
  loading: boolean;
  error: string | null;
}

/**
 * Async operation result - always returns data or throws
 */
export type AsyncHookResult<T> = Promise<T>;

/**
 * Query parameters for paginated/filtered API calls
 */
export interface QueryParams
  extends Record<string, string | number | boolean | undefined> {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
}

/**
 * Search/filter parameters for flexible API queries
 */
export type SearchParams = Record<
  string,
  string | number | boolean | undefined
>;
