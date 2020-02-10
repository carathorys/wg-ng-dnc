export type OrderDirection = 'asc' | 'desc';

/**
 * @description this interface can store the order definition for services
 */
export interface Order<T> {
    orderDirection: OrderDirection;
    orderField: keyof T;
}
