import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Field {
  name: string;
  label: string;
  type: string;
  required: boolean;
}

@Component({
  selector: 'app-dynamic-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dynamic-modal.component.html',
  styleUrls: ['./dynamic-modal.component.css']
})
export class DynamicModalComponent implements OnInit, OnChanges {
  @Input() structure!: Field[];
  @Input() isEdit: boolean = false;
  @Input() formData: any = {};
  @Input() modalId!: string;
  @Output() submitForm = new EventEmitter<any>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.createForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['formData'] && !changes['formData'].firstChange) {
      this.updateForm();
    }
  }

  closePopup() {
    this.form.reset();
    this.formData = {};
  }

  createForm() {
    const formControls: { [key: string]: any } = {};

    this.structure.forEach((field: Field) => {
      formControls[field.name] = [this.isEdit ? this.formData[field.name] : null, field.required ? Validators.required : null];
    });

    this.form = this.fb.group(formControls);
  }

  updateForm() {
    if (this.form) {
      this.structure.forEach((field: Field) => {
        if (this.formData.hasOwnProperty(field.name)) {
          this.form.controls[field.name].setValue(this.formData[field.name]);
        }
      });
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.submitForm.emit(this.form.value);
      this.form.reset();
    } else {
      this.form.markAllAsTouched();
    }
  }
}
