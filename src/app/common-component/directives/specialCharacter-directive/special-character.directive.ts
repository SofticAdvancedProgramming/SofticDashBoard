import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: 'input.input-icon, textarea.input-icon',
  standalone: true
})
export class SpecialCharacterDirective {
  private regex: RegExp = new RegExp(/^[a-zA-Z0-9\u0600-\u06FF \n:\/\.\-_@]*$/);
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Enter'];

  constructor(private el: ElementRef) { }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    let current: string = this.el.nativeElement.value;
    let next: string = current.concat(event.key);
    if (next && !String(next).match(this.regex)) {
      event.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    const clipboardData = event.clipboardData || (window as any).clipboardData;
    let pastedText = clipboardData.getData('text');
    if (pastedText && !this.regex.test(pastedText)) {
      event.preventDefault();
      // Optionally, you can remove invalid characters from the pasted text
      pastedText = pastedText.replace(/[^a-zA-Z0-9\u0600-\u06FF \n]/g, '');
      document.execCommand('insertText', false, pastedText);
    }
  }
}
