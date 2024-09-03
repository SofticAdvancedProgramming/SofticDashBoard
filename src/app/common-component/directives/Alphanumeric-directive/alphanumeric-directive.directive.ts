import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appAlphanumeric]',
  standalone: true,
})
export class AlphanumericDirective {
  // Update the regex to include Arabic characters
  private regex: RegExp = new RegExp(/^[a-zA-Z0-9\u0600-\u06FF]*$/);

  constructor(private ngControl: NgControl) { }

  @HostListener('input', ['$event'])
  onInputChange(event: any) {
    // const initialValue = this.ngControl.value;
    // // Use the updated regex to sanitize the input
    // const sanitizedValue = initialValue.replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, '');
    // if (sanitizedValue !== initialValue) {
    //   this.ngControl.control?.setValue(sanitizedValue);
    //   event.stopPropagation();
    // }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    const clipboardData = event.clipboardData || (window as any).clipboardData;
    let pastedText = clipboardData.getData('text');
    if (pastedText && !this.regex.test(pastedText)) {
      event.preventDefault();
      pastedText = pastedText.replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, '');
      document.execCommand('insertText', false, pastedText);
    }
  }

  @HostListener('copy', ['$event'])
  @HostListener('cut', ['$event'])
  onCopyCut(event: ClipboardEvent) {
    const selection = window.getSelection()?.toString() || '';
    const sanitizedSelection = selection.replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, '');
    event.clipboardData?.setData('text/plain', sanitizedSelection);
    event.preventDefault();
  }
}
