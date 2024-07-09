import { AbstractControl, ValidationErrors, ValidatorFn, FormGroup } from '@angular/forms';

export class PasswordValidator {
  static passwordComplexity(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;
      return control.value && !regex.test(control.value) ? { complexPassword: true } : null;
    };
  }

  static passwordMatch(passwordKey: string, confirmPasswordKey: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const password = formGroup.get(passwordKey);
      const confirmPassword = formGroup.get(confirmPasswordKey);
      if (!password || !confirmPassword) {
        return null;
      }
      return password.value !== confirmPassword.value ? { passwordMismatch: true } : null;
    };
  }
}
