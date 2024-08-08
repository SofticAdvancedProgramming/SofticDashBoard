import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '../input/input.component';
import { MatStepper } from '@angular/material/stepper';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputComponent,
    TranslateModule,
  ],
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.css']
})
export class DynamicFormComponent implements OnInit, OnChanges {
  @Input() config: any[] = [];
  @Input() initialValues: any = {};
  @Input() stepper!: MatStepper;
  @Input() onSubmit!: (...par: any) => void;
  form!: FormGroup;
  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    const group: any = {};
    this.config.forEach(field => {
      const validators = [];
      if (field.required) {
        validators.push(Validators.required);
      }
      if (field.maxLength) {
        validators.push(Validators.maxLength(field.maxLength));
      }
      if (field.minLength) {
        validators.push(Validators.minLength(field.minLength));
      }
      if (field.type === 'email') {
        validators.push(Validators.email);
      }
      group[field.name] = new FormControl('', validators);
    });

    this.form = this.fb.group(group);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['initialValues'] && this.form) {
      this.form.patchValue(this.initialValues);
    }
  }

  handleSubmit() {
    if (this.form.valid) {
      if (this.stepper) {
        this.onSubmit(this.form.value, this.stepper);
      } else {
        this.onSubmit(this.form.value);
      }
    } else {
      this.validateAllFormFields(this.form);
    }
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  goBack(stepper: any): void {
    stepper.previous();
  }

}
