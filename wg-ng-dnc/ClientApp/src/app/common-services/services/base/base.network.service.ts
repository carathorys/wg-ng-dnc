import { Observable, timer } from 'rxjs';
import { combineLatest, debounce } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ConfigurationService } from '../configuration';

import { BaseService } from './base.service';
import {
  HttpFilter,
  Order,
  PagingOperation
} from './interfaces';

export abstract class BaseNetworkService<T, TKey> extends BaseService<T> {

  public isFetching: boolean;

  private readonly triggerNetworkLoad: EventEmitter<{
    order: Order<T>;
    filter: Array<HttpFilter<T>>;
    pager: PagingOperation;
  }> = new EventEmitter<{
    order: Order<T>;
    filter: Array<HttpFilter<T>>;
    pager: PagingOperation;
  }>();

  constructor(
    protected httpClient: HttpClient,
    protected readonly configService: ConfigurationService,
    protected readonly snackBar: MatSnackBar
  ) {
    super();

    this.triggerNetworkLoad.pipe(debounce(() => timer(300))).subscribe(data => {
      this.List(data.pager, data.order, data.filter).catch();
    });

    this._filterEvent
      .pipe(debounce(() => timer(500)))
      .pipe(
        combineLatest<Array<HttpFilter<T>>, Order<T>, PagingOperation>(
          this._orderEvent,
          this._pagerEvent
        )
      )
      .subscribe(([filter, order, pager]) => {
        this.triggerNetworkLoad.next({ filter, order, pager });
      });
  }

  public loadODataQueryResult(data: any): void {
    super.loadQuery(data);
  }

  public loadODataSingleResult(data: T): void {
    super.loadSingle(data);
  }

  protected abstract async Get(key: TKey): Promise<void>;

  protected abstract async List(
    pager: PagingOperation,
    order: Order<T>,
    filter: Array<HttpFilter<T>>
  ): Promise<any>;

  protected abstract async Create(instance: T): Promise<void>;

  protected abstract Update(instance: T): Promise<void>;

  protected abstract async Delete(key: TKey): Promise<void>;

  protected async getUrl<TDto>(url: string): Promise<Observable<TDto>> {
    const configs = await this.configService.getConfigurationAsync();

    return this.httpClient.get<TDto>(`${configs.apiEndpoint}${url}`);
  }

  protected async getUrlBlob(url: string): Promise<Observable<Blob>> {
    const configs = await this.configService.getConfigurationAsync();

    return this.httpClient.get<Blob>(`${configs.apiEndpoint}${url}`, {
      responseType: 'blob' as 'json'
    });
  }

  protected async postUrl<TDto>(url: string, data: any): Promise<Observable<TDto>> {
    const configs = await this.configService.getConfigurationAsync();

    return this.httpClient.post<TDto>(`${configs.apiEndpoint}${url}`, data);
  }

  protected async putUrl<TDto>(url: string, data: any): Promise<Observable<TDto>> {
    const configs = await this.configService.getConfigurationAsync();

    return this.httpClient.put<TDto>(`${configs.apiEndpoint}${url}`, data);
  }

  /**
   * This method should be invoked from outside the service.
   * You should use this method for filter the data which is coming from the server.
   * @param _filter filter The operation you wanted to see
   * @returns a shared observable from the data query
   */
  public filter(filters: Array<HttpFilter<T>>): void {
    this._filterEvent.next(filters);
  }
}
