import { Injectable } from '@angular/core';
import {
  CanLoad,
  UrlSegment,
  Route,
  CanActivate,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  UrlTree,
  Router,
  CanActivateChild,
} from '@angular/router';
import { AuthService } from '../auth';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanLoad, CanActivate, CanActivateChild {

  constructor(private readonly authService: AuthService, private readonly router: Router) {}

  public async canLoad(route: Route, segments: UrlSegment[]): Promise<boolean> {
    const isLoggedIn = await this.authService.IsLoggedIn();
    if (isLoggedIn) {
      return true;
    }
    await this.authService.initiateLoginSequence(segments);

    return false;
  }

  public async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Promise<boolean | UrlTree> {
    const isLoggedIn = await this.authService.IsLoggedIn();
    if (isLoggedIn) {
      return true;
    }
    await this.authService.initiateLoginSequence(
      this.router.getCurrentNavigation()?.extractedUrl?.root?.children?.primary?.segments,
    );

    return false;
  }

  public async canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
      return this.canActivate(childRoute, state);
  }
}
