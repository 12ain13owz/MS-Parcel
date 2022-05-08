import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/auth.service';
import { TokenService } from '../../shared/token.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['../pages.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  form: FormGroup;
  isProgressBar: boolean = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private token: TokenService,
    private auth: AuthService
  ) {
    this.createFormLogin();
  }

  ngOnInit(): void {
    if (this.token.getToken()) {
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.auth.onLogin(this.form.value).subscribe({
      next: (data) => {
        this.token.saveToken(data.accessToken);
        this.token.saveUser(data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  isError(control: AbstractControl, errorKey: string) {
    if (control.invalid && control.touched) {
      return control.errors?.[errorKey];
    }
    return false;
  }

  createFormLogin() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      remember: [false],
    });
  }

  get email() {
    return this.form.controls['email'];
  }

  get password() {
    return this.form.controls['password'];
  }

  get remember() {
    return this.form.controls['remember'];
  }
}
