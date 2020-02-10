import { Component } from '@angular/core';
import { AuthService } from './common-services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.pug',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public readonly router: Router, private readonly authService: AuthService) {
  }
}
