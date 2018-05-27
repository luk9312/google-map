import { AbstractControl } from '@angular/forms';

export class settingValidators {
  static checkZoom(control: AbstractControl) {
    const value = control.value;
    return typeof(value) === 'number' && value >=4 && value<=12 ? null : {invalidZoom: true};
  }

  static checkLength(control: AbstractControl){
    const value = control.value;
    return typeof(value) === 'number' && value >=10 && value<=100 ? null : {invalidLength: true};
  }
}