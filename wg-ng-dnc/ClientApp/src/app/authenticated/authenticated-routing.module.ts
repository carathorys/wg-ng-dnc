import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from './layout';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: LayoutComponent,
        loadChildren: () =>
          import('./authenticated-routes/authenticated-routes.module').then(
            (m) => m.AuthenticatedRoutesModule,
          ),
      },
    ]),
  ],
  exports: [RouterModule],
})
export class AuthenticatedRoutingModule {}
