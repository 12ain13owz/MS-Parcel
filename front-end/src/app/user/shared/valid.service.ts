import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ValidService {
  constructor() {}

  validateAllformFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control: any = formGroup.get(field);
      if (control instanceof FormControl)
        control.markAsDirty({ onlySelf: true });
      //else if (control instanceof FormGroup) this.validateAllformFields(control);
    });
  }

  comparePassword(passwordField: string): object {
    return (cpassword: AbstractControl) => {
      if (!cpassword.parent) return;

      const password = cpassword.parent.get(passwordField);
      const passwordSubscripe = password?.valueChanges.subscribe(() => {
        cpassword.updateValueAndValidity();
        passwordSubscripe?.unsubscribe();
      });

      if (cpassword.value === password?.value) return;
      return { compare: true };
    };
  }

  patternPassword(password: AbstractControl) {
    if (password.value == '') return;
    if (/^[A-z0-9]{6,15}$/.test(password.value)) return;
    return { password: true };
  }
}
