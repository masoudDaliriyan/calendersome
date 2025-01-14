import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validates that the startTime is before the endTime in a form group.
 */
export function timeRangeValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const startTime = group.get('startTime')?.value;
    const endTime = group.get('endTime')?.value;

    if (startTime && endTime && startTime >= endTime) {
      return { timeRangeInvalid: true };
    }

    return null;
  };
}
