import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthFormComponent } from './components';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: AuthFormComponent,
      },
      {
        path: '**',
        redirectTo: '',
      },
    ]),
  ],
  exports: [RouterModule],
})
export class AuthenticationRoutingModule {}
