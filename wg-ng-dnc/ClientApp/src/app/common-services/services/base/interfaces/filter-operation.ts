/**
 * Interface for use a filter operation
 */
export type IFilterOperation<T> = (instance: T, index: number) => boolean;

export type FilterType = 'eq' | 'contains' | 'gte' | 'lte' | 'gt' | 'lt'; // ... more types added
/**
 * @description this interface will be used to define one filter for the Http requests
 */
export interface HttpFilter<T> {
  value: T[keyof T];
  field: keyof T;
  filterType: FilterType;
}
