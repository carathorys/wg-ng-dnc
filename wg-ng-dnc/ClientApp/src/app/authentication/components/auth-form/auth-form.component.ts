import { Component, OnInit } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormGroupDirective, NgForm, FormControl, Validators, FormGroup } from '@angular/forms';
import { CloseScrollStrategy } from '@angular/cdk/overlay';
import { AuthService } from 'src/app/common-services';
import { Router, ActivatedRoute, UrlSegment } from '@angular/router';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.pug',
  styleUrls: ['./auth-form.component.scss'],
})
export class AuthFormComponent implements OnInit {
  matcher = new MyErrorStateMatcher();
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });
  private readonly redirectOnSuccess: UrlSegment[];

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
  ) {
    this.redirectOnSuccess = this.router.getCurrentNavigation()?.extras?.state?.additionalState;
  }

  ngOnInit(): void {}

  get password() {
    return this.loginForm.get('password');
  }
  get email() {
    return this.loginForm.get('email');
  }

  async onSubmit() {
    if (this.loginForm.valid === true) {
      const success = await this.authService.doLogin(
        this.email.value,
        this.password.value,
      );
      if (success === true) {
        await this.router.navigate([`/${this.redirectOnSuccess?.join('/') ?? 'u'}`]);
      }
    }
  }
}
