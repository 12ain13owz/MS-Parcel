import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/auth.service';
import { RegisterModel } from '../../shared/member.model';
import { NotifyService } from '../../shared/notify.service';
import { ValidService } from '../../shared/valid.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../pages.component.scss'],
})
export class RegisterComponent implements OnInit {
  @ViewChild('inputEmail') inputEmail: ElementRef;

  form: FormGroup;
  isProgressBar: boolean = false;
  isDisabled: boolean = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private auth: AuthService,
    private valid: ValidService,
    private notify: NotifyService
  ) {
    this.createFormRegister();
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.inputEmail.nativeElement.focus();
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const formRegister: RegisterModel = {
      email: this.email.value,
      password: this.password.value,
    };
    this.isProgressBar = true;
    this.isDisabled = true;
    this.auth
      .onRegister(formRegister)
      .subscribe({
        next: (data) => {
          this.notify.showNotify('success', data.message);
          this.router.navigate(['/login']);
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

  createFormRegister() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      cpassword: [
        '',
        [Validators.required, this.valid.comparePassword('password')],
      ],
    });
  }

  get email() {
    return this.form.controls['email'];
  }

  get password() {
    return this.form.controls['password'];
  }

  get cpassword() {
    return this.form.controls['cpassword'];
  }
}
