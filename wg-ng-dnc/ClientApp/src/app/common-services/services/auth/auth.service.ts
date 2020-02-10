import { EventEmitter, Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

import { filter, first } from 'rxjs/operators';

import { Router, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { Configuration, User } from '../../models';
import { ConfigurationService } from '../configuration';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public get OnLoggedOut(): Observable<void> {
    return this.loggedOut.asObservable();
  }
  public get OnLoggedIn(): Observable<void> {
    return this.loggedIn.asObservable();
  }
  public get User(): Observable<User> {
    return this.user.asObservable();
  }

  private readonly STORAGE_KEY = 'user';

  private readonly loggedOut = new EventEmitter<void>(false);
  private readonly loggedIn = new EventEmitter<void>(false);
  private readonly userProfile = new BehaviorSubject<any>(undefined);
  private readonly user = new BehaviorSubject<User>(undefined);
  /**
   * Internal subjects
   */
  private readonly isInitialized = new BehaviorSubject<boolean>(false);
  private readonly isLoggedIn = new BehaviorSubject<boolean>(false);

  private configuration: Configuration;

  constructor(
    configService: ConfigurationService,
    // private readonly oauthService: OAuthService,
    private readonly router: Router,
  ) {
    configService
      .getConfigurationAsync()
      .then((config) => {
        this.configuration = config;
        this.configureWithNewConfigApi()
          .then(() => {
            this.isInitialized.next(true);
          })
          .catch();
      })
      .catch();

    this.isLoggedIn.subscribe((loggedin) => {
      if (loggedin) {
        this.loggedIn.emit();
      } else {
        this.loggedOut.emit();
      }
    });

    this.userProfile.subscribe((data) => {
      if (!!data) {
        this.user.next({
          Email: data.email,
          FamilyName: data.family_name,
          GivenName: data.given_name,
          Id: data.sub,
          UserName: data.preferred_username,
        });
      }
    });
  }

  /**
   * @description gets the user object once
   */
  public GetUser(): User {
    return this.user.value;
  }

  public HasAccess(task: string): boolean {
    return false;
  }

  public getAccessToken(): string {
    return 'mocked'; // this.oauthService.getAccessToken();
  }

  /**
   * @description waits until the service initializes the OAuth service, then it will resove, or reject the request
   */
  public async IsLoggedIn(): Promise<boolean> {
    return new Promise((resolve) =>
      this.isInitialized
        .pipe(filter((x) => x === true))
        .pipe(first())
        .subscribe(() => {
          resolve(this.isLoggedIn.value);
        }),
    );
  }

  /**
   * logOut
   * @description The user should be logged out only via this method
   */
  public async logOut(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.isInitialized
        .pipe(filter((x) => x === true))
        .pipe(first())
        .subscribe(() => {
          if (this.isLoggedIn.value) {
            this.isLoggedIn.next(false);
            resolve();
          } else {
            reject();
          }
        });
    });
  }

  /**
   * logIn
   * @description The user login should be initiated with this method only
   */
  public async initiateLoginSequence(additionalState?: UrlSegment[]): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.isInitialized
        .pipe(filter((x) => x === true))
        .pipe(first())
        .subscribe(async () => {
          if (!(await this.IsLoggedIn())) {
            await this.router.navigate(['/auth'], {
              state: { additionalState },
            });
            // this.oauthService.initImplicitFlow(!!additionalState ? additionalState.url : '');
            resolve();

            return;
          }
          resolve();
        });
    });
  }

  public async doLogin(username: string, pwd: string): Promise<boolean> {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify({ username }));

    if ((await this.IsLoggedIn()) === true) {
      return true;
    }
    return false;
  }
  /**
   * @description this method will configure the OAuth service using the environment variables,
   * then it will try to log in the user
   */
  private async configureWithNewConfigApi(): Promise<void> {
    // this.oauthService.configure({
    //   ...this._configuration.oauthSettings
    // });

    // await this.oauthService.loadDiscoveryDocument()
    //   .catch(e => { window.alert(`There is an issue with the widp.\n${e.message}`); });

    try {
      // loginResult = await this.oauthService.tryLogin({
      //   onTokenReceived: async info => {
      //     setTimeout(() => {
      //       if (!!info && info.state) {
      //         this.router
      //           .navigateByUrl(info.state)
      //           .then()
      //           .catch();
      //       }
      //     }, 1000);
      //   }
      // });
    } catch (error) {
      // tslint:disable-next-line: no-empty
    }

    // if (this.oauthService.hasValidAccessToken() && this.oauthService.hasValidIdToken()) {
    //   const userProf = {
    //     ...this.oauthService.getIdentityClaims(),
    //     scope: this.parseAccessToken().scope
    //   };
    if (!!localStorage.getItem(this.STORAGE_KEY)) {
      this.isLoggedIn.next(true);
    }
    //   const requestedScopes = this._configuration.oauthSettings.scope.split(' ');

    //   if (!userProf.scope) {
    //     alert('You are not authorized!');
    //   }
    //   // tslint:disable-next-line: max-line-length
    //   const grantedScopesFromRequest = userProf.scope.filter(x => requestedScopes.indexOf(x) > 0);

    //   if (!userProf || grantedScopesFromRequest.length < 0) {
    //     await this.router.navigateByUrl('unauthorized');
    //   }

    //   this.userProfile.next(userProf);
    //   try {
    //     await this.oauthService.silentRefresh({}, false);
    //     this.oauthService.setupAutomaticSilentRefresh();
    //   } catch (error) {
    //     alert('Silent refresh is disabled!');
    //   }
    // }
    setTimeout(() => {
      this.isLoggedIn.next(true);
      this.userProfile.next({});
    }, 5000);
  }
}
