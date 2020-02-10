import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './components';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: DashboardComponent,
      },
      {
        path: ':id',
        children: [
          {
            path: 'clients',
            children: [
              {
                path: ':client-id',
                component: DashboardComponent,
                data: {
                  id: ':id',
                  clientId: ':client-id',
                },
              },
            ],
          },
        ],
      },
    ]),
  ],
  exports: [RouterModule],
})
export class AuthenticatedRoutesRoutingModule {}
