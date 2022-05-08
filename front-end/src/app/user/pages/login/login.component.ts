import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/auth.service';
import { NotifyService } from '../../shared/notify.service';
import { TokenService } from '../../shared/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../pages.component.scss'],
})
export class LoginComponent implements OnInit {
  @ViewChild('inputEmail') inputEmail: ElementRef;

  form: FormGroup;
  isProgressBar: boolean = false;
  isDisabled: boolean = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private token: TokenService,
    private auth: AuthService,
    private notify: NotifyService
  ) {
    this.createFormLogin();
  }

  ngOnInit(): void {
    if (this.token.getToken()) {
      this.router.navigate(['/scan']);
    }
  }

  ngAfterViewInit() {
    this.inputEmail.nativeElement.focus();
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.isProgressBar = true;
    this.isDisabled = true;
    this.auth
      .onLogin(this.form.value)
      .subscribe({
        next: (data) => {
          this.token.saveToken(data.accessToken);
          this.token.saveRefreshToken(data.refreshToken);
          this.token.saveUser(data);
          this.notify.showNotify('success', 'Log in successfully');
          this.router.navigate(['/scan']);
        },
        error: (err) => {
          if (err.status === 500) {
            this.notify.showNotify('error', 'Error (500) Bad Request!');
          } else this.notify.showNotify('error', err.error.message);
        },
      })
      .add(() => {
        this.isProgressBar = false;
        this.isDisabled = false;
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
