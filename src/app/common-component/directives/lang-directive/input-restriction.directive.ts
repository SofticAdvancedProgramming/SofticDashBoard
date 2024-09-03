import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appInputRestriction]',
  standalone: true
})
export class InputRestrictionDirective {
  @Input('appInputRestriction') restrictionType: 'arabic' | 'english' | undefined;

  private arabicRegex = /[\u0600-\u06ff]|[\u0750-\u077f]|[\ufb50-\ufbc1]|[\ufbd3-\ufd3f]|[\ufd50-\ufd8f]|[\ufd92-\ufdc7]|[\ufe70-\ufefc]|[\uFDF0-\uFDFD]/;

  private englishRegex = /[A-Za-z]/g;

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInputChange(event: Event) {
    const input = this.el.nativeElement.value;
    if (this.restrictionType === 'arabic') {
      this.el.nativeElement.value = input.replace(this.arabicRegex, '');
    } else if (this.restrictionType === 'english') {
      this.el.nativeElement.value = input.replace(this.englishRegex, '');
    }
    if (input !== this.el.nativeElement.value) {
      event.stopPropagation();
    }
  }
}
