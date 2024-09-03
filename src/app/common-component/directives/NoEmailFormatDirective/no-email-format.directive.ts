import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appNoEmailFormat]',
  standalone: true,

})
export class NoEmailFormatDirective {

  constructor(private ngControl: NgControl) { }

  @HostListener('input', ['$event'])
  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/[@.]/g, ''); 
    this.ngControl.control?.setValue(value);
  }
}
