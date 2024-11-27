import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
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
  @Input() currencyModelId!: string;
  @Output() submitForm = new EventEmitter<any>();

  form!: FormGroup;
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['formData'] && this.form) {
      console.log(this.formData, "FROM ngOnChanges")
      this.form.patchValue(this.formData);
    }
  }


  closePopup() {
    this.form.reset();
    this.formData = {};
  }

  initializeForm() {
    const formControls: { [key: string]: any } = {};
    this.structure.forEach((field: Field) => {
      if (field.type === 'checkbox') {
        formControls[field.name] = [this.isEdit ? this.formData[field.name] : false, field.required ? Validators.required : false];
      } else {
        formControls[field.name] = [this.isEdit ? this.formData[field.name] : null, field.required ? Validators.required : null];
      }
    });
    this.form = this.fb.group(formControls);
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
