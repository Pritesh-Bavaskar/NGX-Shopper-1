import { Injectable } from '@angular/core';
import { FormControl, FormGroup, AbstractControl } from '@angular/forms';
import { debugOutputAstAsTypeScript } from '@angular/compiler';

@Injectable()
export class AppFormErrorService {
  displayFormErrors(form: FormGroup) {
    Object.keys(form.controls).forEach((key) => {
      form.get(key).markAsDirty();
    });
  }

  hasValidEmailError(input: FormControl | AbstractControl): boolean {
    return (
      (input.hasError('required') || input.hasError('email')) && input.dirty
    );
  }

  hasPasswordMismatchError(form: FormGroup) {
    return form.hasError('ocMatchFields');
  }

  hasInvalidIdError(input: FormControl | AbstractControl) {
    return input.hasError('invalidIdError') && input.dirty;
  }

  hasRequiredError(controlName: string, form: FormGroup) {
    const control = form.get(controlName);
    return control && control.hasError('required') && control.dirty;
  }

  hasInvalidZipError(controlName: string, form: FormGroup) {
    return (
      form.get(controlName).hasError('zipInvalid') &&
      form.get(controlName).dirty
    );
  }
}
