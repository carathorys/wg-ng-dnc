import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.pug',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit {
  constructor(private readonly router: Router, private readonly authService: AuthService) {}

  ngOnInit() {
    setTimeout(() => {
      this.router.navigate(['/u']);
    }, 2000);
  }
}
