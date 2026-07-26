import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function matchFieldValidator(matchTo: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const parent = control.parent;
    if (!parent) return null;

    const matchControl = parent.get(matchTo);
    if (!matchControl) return null;

    return control.value === matchControl.value ? null : { match: true };
  };
}
