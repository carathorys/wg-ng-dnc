import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { first, map, scan, share } from 'rxjs/operators';

import {
  HttpFilter,
  IFilterOperation,
  IMapOperation,
  Order,
  OrderDirection,
  PagingOperation
} from './interfaces';

export abstract class BaseService<T> {
  protected abstract get KeyField(): keyof T;

  protected readonly _orderEvent: BehaviorSubject<Order<T>> = new BehaviorSubject<Order<T>>(
    undefined
  );
  protected readonly _filterEvent: BehaviorSubject<Array<HttpFilter<T>>> = new BehaviorSubject<
    Array<HttpFilter<T>>
  >(undefined);
  protected readonly _pagerEvent: BehaviorSubject<PagingOperation> = new BehaviorSubject<
    PagingOperation
  >({ count: 15, page: 0 });
  protected readonly dataCount: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  /**
   * @description Actual data storage, set to the initial state
   */
  private readonly data: Array<T> = [];

  private readonly _dataSource: BehaviorSubject<Array<T>> = new BehaviorSubject<Array<T>>([]);
  private readonly _changeSource: ReplaySubject<IMapOperation<T>> = new ReplaySubject<
    IMapOperation<T>
  >(1);
  private readonly _loadQueryToSource: ReplaySubject<Array<T>> = new ReplaySubject<Array<T>>(1);

  private readonly _loadSingleToSource: ReplaySubject<T> = new ReplaySubject<T>(undefined);
  private readonly _updateSource: ReplaySubject<T> = new ReplaySubject<T>(1);
  private readonly _createSource: ReplaySubject<T> = new ReplaySubject<T>(1);
  private readonly _deleteSource: ReplaySubject<T> = new ReplaySubject<T>(undefined);

  constructor() {
    this.setupRXSources();
  }

  /**
   * This method should be invoked from outside the service.
   * You should use this method for filter the data which is coming from the server.
   * @param _filter filter The operation you wanted to see
   * @returns a shared observable from the data query
   */
  public filterExisting(_filter: IFilterOperation<T>): Observable<Array<T>> {
    return this._dataSource.pipe(map(dataArray => dataArray.filter(_filter))).pipe(share());
  }

  /**
   * This method should be invoked from outside the service,
   * when you create a new instance from the type T. When you use this method,
   * it should save the object into the remote repository.
   * @param instance the instance which should be created
   */
  public async create(instance: T): Promise<void> {
    this._createSource.next(instance);
  }

  /**
   * This method should be invoked from outside the service,
   * when you update an instance from the type T.
   * When you use this method, it should save the object into the remote repository.
   * @param instance which should be updated
   */
  public async update(instance: T): Promise<void> {
    this._updateSource.next(instance);
  }

  /**
   * This method should be invoked from outside the service,
   * when you delete an instance from the type T.
   * When you use this method, it should remove the object from the remote repository.
   * @param instance which should be deleted
   */
  public async delete(instance: T): Promise<void> {
    await this.deleteBy(instance[this.KeyField], this.KeyField);
  }

  /**
   * This method should be invoked from outside the service,
   * when you delete an instance from the type T by it's key field.
   * When you use this method, it should remove the object from the remote repository.
   * @param key which instance should be deleted
   */
  public async deleteBy(key: T[keyof T], field: keyof T = this.KeyField): Promise<void> {
    const instance = await this.findBy(key, field).toPromise();
    this._deleteSource.next(instance);
  }

  public setPager(count = 15, page = 0): void {
    this._pagerEvent.next({ count, page });
  }

  public orderBy(column: keyof T, direction: OrderDirection): void {
    if (direction) {
      this._orderEvent.next({ orderField: column, orderDirection: direction });
    } else {
      this._orderEvent.next(undefined);
    }
  }

  /**
   * Returns with the first entity with the given key field
   * @returns instance as observable
   */
  public findBy(value: T[keyof T], field: keyof T = this.KeyField): Observable<T> {
    return this.filterExisting((instance: T) => this.getValue(instance, field) === value)
      .pipe(map((arr: Array<T>) => (arr.length > 0 ? arr[0] : undefined)))
      .pipe(first());
  }

  /**
   * Returns the KEYFIELD value from the given instance
   * @returns the value of the key field
   */
  public getValue(instance: T, field: keyof T = this.KeyField): T[keyof T] {
    return instance[field];
  }

  /**
   * External sources can subscribe for data count change
   */
  public subscribeDataCount(): Observable<number> {
    return this.dataCount.asObservable();
  }

  // /**
  //  * Returns the KEYFIELD value from the given instance
  //  * @returns the value of the key field
  //  */
  // getValues(field: keyof T = this.KeyField): Array<T[keyof T]> {
  //   return this.data.map(this.getValue.bind(this));
  // }

  /**
   * This method should be invoked from inside the service,
   * when you load multiple instances from the type T.
   * When you use this method, add an array to the local data source.
   * @param instances Array of newly added instances
   */
  public loadQuery(instances: any): void {
    this._loadQueryToSource.next(instances);
  }

  /**
   * This method should be invoked from inside the service,
   * when you load single instance from the type T.
   * When you use this method, add an instance to the local data source.
   * @param instance Instance of newly added instances
   */
  public loadSingle(instance: T): void {
    this._loadSingleToSource.next(instance);
  }

  public cleanDataSource(): void {
    this._dataSource.next(undefined);
  }

  /**
   * @returns the data source as an observable
   */
  public get dataSource(): Observable<Array<T>> {
    return this._dataSource.asObservable();
  }

  /**
   * @returns the creation observable
   */
  public get createSource(): Observable<T> {
    return this._createSource.asObservable();
  }

  /**
   * @returns entity updates observable
   */
  public get updateSource(): Observable<T> {
    return this._updateSource.asObservable();
  }

  /**
   * @returns entity deletions observable
   * @todo it was protected, does it needed as a protected one?
   */
  public get deleteSource(): Observable<T> {
    return this._deleteSource.asObservable();
  }

  protected _loadSourceHandler(instances: Array<T>, dataStore: Array<T>): Array<T> {
    // TODO: Temp solution since old objects won't be removed with this if statement
    dataStore.length = 0;
    if (!!instances && !!instances.length) {
      instances.forEach(instance => {
        if (!dataStore.find(x => x[this.KeyField] === instance[this.KeyField])) {
          dataStore.push(instance);
        } else {
          this._update(instance, dataStore);
        }
      });
    }

    return dataStore;
  }

  protected _loadSingleToSourceHandler(instance: T, dataStore: Array<T>): Array<T> {
    if (!dataStore.find(x => x[this.KeyField] === instance[this.KeyField])) {
      dataStore.length = 0;
      dataStore.push(instance);
    } else {
      this._update(instance, dataStore);
    }

    return dataStore;
  }

  /**
   * Setup, and initialize RXJS sources
   */
  protected setupRXSources(): void {
    this._changeSource
      .pipe(
        scan((dataStore: Array<T>, operation: IMapOperation<T>) => operation(dataStore), this.data)
      )
      .subscribe(d => {
        this._dataSource.next(d);
      });

    this._updateSource
      .pipe(map((instance: T) => (dataStore: Array<T>) => this._update(instance, dataStore)))
      .subscribe(this._changeSource);

    this._createSource
      .pipe(
        map((instance: T) => (dataStore: Array<T>) => {
          dataStore.push(instance);

          return dataStore;
        })
      )
      .subscribe(this._changeSource);

    this._loadQueryToSource
      .pipe(
        // tslint:disable-next-line:arrow-return-shorthand
        map((instances: Array<T>) => (dataStore: Array<T>): Array<T> =>
          this._loadSourceHandler(instances, dataStore)
        )
      )
      .subscribe(this._changeSource);

    this._loadSingleToSource
      .pipe(
        // tslint:disable-next-line:arrow-return-shorthand
        map((instance: T) => (dataStore: Array<T>): Array<T> =>
          this._loadSingleToSourceHandler(instance, dataStore)
        )
      )
      .subscribe(this._changeSource);

    this._deleteSource
      .pipe(
        map((instanceToDelete: T) => (dataStore: Array<T>) =>
          dataStore.filter(
            (instance: T) => instance[this.KeyField] !== instanceToDelete[this.KeyField]
          )
        )
      )
      .subscribe(this._changeSource);
  }

  /**
   * A helper method for handle the RXJS sources.
   * @param instance is the updated entity
   * @param dataStore is the service's private data array
   */
  private _update(instance: T, dataStore: Array<T>): Array<T> {
    const index: number = dataStore.findIndex(
      (_instance: T) => _instance[this.KeyField] === instance[this.KeyField]
    );

    if (index >= 0) {
      dataStore[index] = instance;
    } else {
      throw new Error('Instance not found in the data source!');
    }

    return dataStore;
  }
}
