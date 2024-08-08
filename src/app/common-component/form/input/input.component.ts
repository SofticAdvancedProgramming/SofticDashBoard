import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputConfig } from '../../interfaces/inputConfig';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../../core/services/translationService/translation.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    TranslateModule
  ],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css'
})
export class InputComponent implements OnChanges {
  public imageUrl: string | ArrayBuffer | null = null;
  textLengths: { [key: string]: number } = {};
  @Input() config!: InputConfig;
  @Input() form!: FormGroup;
  @Input() onRefPhotoChange!: (event: any) => void;
  @Input() onSelectChangeInput!: (...par: any) => void;

  constructor(
    private translateService: TranslationService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config'] && this.form) {
      if (this.config.type === 'file') {
        const fileControl = this.form.get(this.config.name);
        if (fileControl) {
          fileControl.valueChanges.subscribe((value) => {
            if (fileControl.valid && value) {
              this.imageUrl = value;
            }
          });
        }
      }
    }
  }


  get isValid() {
    const control = this.form.controls[this.config.name];
    return control.valid && (control.dirty || control.touched);
  }

  get isInvalid() {
    const control = this.form.controls[this.config.name];
    return control.invalid && (control.dirty || control.touched);
  }

  handleFileChange(event: any, name: string) {
    const input = event.target as HTMLInputElement;
    const file: File | null = input.files ? input.files[0] : null;
    if (file) {
      this.onRefPhotoChange(event);
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSelectChange(ev: any) {
    if (this.onSelectChangeInput) {
      this.onSelectChangeInput(ev.target?.value);
    }
  }

  removeFile(formControlName: string) {
    this.imageUrl = null;
    this.form.get(formControlName)?.reset();
  }



  updateLength(controlName: string) {
    const control = this.form.get(controlName);
    if (control) {
      this.textLengths[controlName] = control.value.length;
    }
  }

  getLength(controlName: string, target: number): number {
    if (target === this.textLengths[controlName]) {
    }
    return this.textLengths[controlName] || 0;
  }

  isTargetReached(controlName: string, target: number): boolean {
    return this.textLengths[controlName] >= target;
  }

  getErrorMessage(): string {
    const control: AbstractControl = this.form.controls[this.config.name];
    if (control.errors) {
      if (control.hasError('required')) {
        return this.translateService.translate(`${this.config.label || this.config.name} is required`);
      }
      if (control.hasError('email')) {
        return this.translateService.translate('Invalid email');
      }
      if (control.hasError('minlength')) {
        return this.translateService.translate(`${this.config.label || this.config.name} should be at least ${control.errors['minlength'].requiredLength} characters`);
      }
      if (control.hasError('maxlength')) {
        return this.translateService.translate(`${this.config.label || this.config.name} should not exceed ${control.errors['maxlength'].requiredLength} characters`);
      }
      if (control.hasError('min')) {
        return this.translateService.translate(`${this.config.label || this.config.name} should not be after ${control.errors['min'].max}`);
      }
      if (control.hasError('max')) {
        return this.translateService.translate(`${this.config.label || this.config.name} should not be after ${control.errors['max'].max}`);
      }
    }
    return '';
  }


}
