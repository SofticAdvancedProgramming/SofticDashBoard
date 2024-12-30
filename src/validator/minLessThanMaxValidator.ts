import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

 
export const minLessThanMaxValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const min = control.get('min')?.value;
  const max = control.get('max')?.value;

  if (min != null && max != null && min >= max) {
    return { minGreaterThanMax: true };
  }
  return null; // No errors
};
