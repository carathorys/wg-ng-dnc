import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { filter, first } from 'rxjs/operators';
import { Configuration } from '../../models/configuration.model';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationService {
  private readonly isInitialized: BehaviorSubject<boolean>;
  private readonly isTriggered: BehaviorSubject<boolean>;
  private readonly configuration: BehaviorSubject<Configuration>;

  constructor(private readonly httpClient: HttpClient) {
    this.isInitialized = new BehaviorSubject(false);
    this.isTriggered = new BehaviorSubject(false);
    this.configuration = new BehaviorSubject(undefined);

    combineLatest(this.isInitialized, this.isTriggered)
      .pipe(filter(([isInitialized, isTriggered]) => !isInitialized && isTriggered))
      .pipe(first())
      .subscribe(() => {
        this.initializeConfiguration();
      });

    this.isTriggered.next(true);
  }

  /**
   * @description Downloads the configuration from the server, and returns with it
   * @returns async Configuration
   * @see Configuration
   */
  public async getConfigurationAsync(): Promise<Configuration> {
    return new Promise<Configuration>((resolve, reject) => {
      this.isInitialized
        .pipe(filter((isInitializedValue) => !!isInitializedValue)) // Kicks only when set to `true`
        .pipe(first())
        .subscribe(() => {
          resolve(this.configuration.value);
        }, reject);
    });
  }

  // public async getOAuthModuleConfigAsync(): Promise<OAuthModuleConfig> {
  //     return (await this.getConfigurationAsync()).oauth2ModuleSettings;
  // }

  // public getOAuthModuleConfig(): OAuthModuleConfig {
  //     return this._configuration.value ? this._configuration.value.oauth2ModuleSettings : undefined;
  // }

  /**
   * @description Initializes the configuration service with downloading the application's settings
   * When done, sets the `_configuration` observable's value, and the `_isInitialized` observables value to `true`
   */
  private initializeConfiguration(): void {
    this.httpClient.get<Configuration>('assets/config.json').subscribe((config) => {
      this.configuration.next(config);
      this.isInitialized.next(true);
    });
  }
}
