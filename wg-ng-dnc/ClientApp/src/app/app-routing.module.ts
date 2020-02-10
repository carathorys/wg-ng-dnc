import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuardService, NoContentComponent, WelcomeComponent } from './common-services';

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        {
          path: '',
          pathMatch: 'full',
          component: WelcomeComponent,
        },
        {
          path: 'u',
          pathMatch: 'prefix',
          canActivate: [AuthGuardService],
          canActivateChild: [AuthGuardService],
          // canLoad: [AuthGuardService],
          loadChildren: () =>
            import('./authenticated/authenticated.module').then((m) => m.AuthenticatedModule),
        },
        {
          path: 'auth',
          pathMatch: 'prefix',
          loadChildren: () =>
            import('./authentication/authentication.module').then((m) => m.AuthenticationModule),
        },
        {
          path: 'unauthorized',
          pathMatch: 'prefix',
          loadChildren: () =>
            import('./unauthorized/unauthorized.module').then((m) => m.UnauthorizedModule),
        },
        {
          path: 'not-found',
          component: NoContentComponent,
        },
        { path: '**', component: NoContentComponent },
      ],
      {
        // enableTracing: true
      },
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
