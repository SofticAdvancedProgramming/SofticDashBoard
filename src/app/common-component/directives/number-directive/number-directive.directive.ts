import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appNumberDirective]',
  standalone: true
})
export class NumberDirectiveDirective {

  constructor() { }

  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    const allowedKeys = [
      'Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Delete', 'Enter'
    ];

    if (allowedKeys.includes(event.key)) {
      return;
    }

    if (event.key < '0' || event.key > '9') {
      event.preventDefault();
    }
  }

  @HostListener('paste', ['$event']) onPaste(event: ClipboardEvent) {
    const clipboardData = event.clipboardData;
    const pastedText = clipboardData?.getData('text') ?? '';

    if (!pastedText.match(/^[0-9]*$/)) {
      event.preventDefault();
    }
  }
}
